import Vue, {Component} from ".";
import {noop, isPlainObject} from "src/shared/util";
import {observe, defineReactivity, set, del} from "../reactivity/Observer";
import {pushTarget, popTarget, Dep} from "../reactivity/Dep";
import {warn} from "src/shared/debug";
import {Watcher, IWatcherOptions, WatcherCallback} from "../reactivity/Watcher";

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: _ => {}
};

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

/**
 * this.$watch('name', (newVal, oldVal) => {}, opts)
 */
export const vueProto$watch = function(
  expOrFn: string | Function,
  cb: WatcherCallback,
  options?: IWatcherOptions
): Function {
  const vm: Component = this;

  options = options || {};
  options.user = true;
  const watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      warn(`callback for immediate watcher "${expOrFn}"`, error, vm);
    }
  }
  return function unwatchFn() {
    watcher.teardown();
  };
};
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  // @TODO init props, involve in fn createComponent
  // if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}));
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);

  for (const key in propsOptions) {
    keys.push(key);
    const value = undefined;

    defineReactivity(props, key, value);

    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
}

function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};

  // proxy data on instance

  Object.keys(data).forEach(key => {
    proxy(vm, `_data`, key);
  });

  observe(data);
}

export function getData(data: Function, vm: Component): any {
  pushTarget();
  try {
    return data.call(vm, vm);
  } catch (e) {
    warn("Exception in data()", e, vm);
    return {};
  } finally {
    popTarget();
  }
}

function initMethods(vm: Component, methods: {[key: string]: Function}) {
  for (const key in methods) {
    vm[key] = methods[key].bind(vm);
  }
}

// const vm = new Vue({
//   watch: {
//     'someKey': () => { },
//     'otherKey': {
//       handler: () => { },
//       immediate: true
//     }
//   }
// })
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}

const computedWatcherOptions = {lazy: true};

// const vm = new Vue({
//   computed: {
//     somePropToCalc() {
//       return this.name + this.age
//     }
//   }
// })
type ComputedFnMap = {[key: string]: Function};
function initComputed(vm: Component, computed: ComputedFnMap) {
  const watchers = (vm._computedWatchers = Object.create(null));

  for (const key in computed) {
    const getter = computed[key];

    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    );

    if (!(key in vm)) {
      defineComputed(vm, key, computed[key]);
    } else {
      warn(
        `Key ${key} already defined on Vue instance when defining computed attribute`
      );
    }
  }
}

export function defineComputed(target: any, key: string, userDef: Function) {
  sharedPropertyDefinition.get = createComputedGetter(key);
  sharedPropertyDefinition.set = function() {
    warn(
      `Computed property "${key}" was assigned to but it has no setter.`,
      this
    );
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const vm: Component = this;
    const watcher = vm._computedWatchers && vm._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
