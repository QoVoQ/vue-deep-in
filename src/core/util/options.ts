import {Component} from "src";
import {ComponentLifecycleName} from "../instance/lifecycle";
import {isDef, isPlainObject} from "src/shared/util";

interface ICtorOpt {
  props?: any;
  methods?: {[key: string]: Function};
  computed?: {[key: string]: Function};
  watch?: {
    [key: string]:
      | Function
      | {handler: Function; deep?: boolean; immediate?: boolean};
  };
  name?: string;
  el?: Element | string;
  components?: object;
  propsData?: object;
  data?: () => object;

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.created]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mounted]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroyed]?: Function | Function[];
}

const mergeStrategy: {[key: string]: Function} = Object.create(null);

const defaultStrategy = (parentVal, childVal) => {
  return isDef(childVal) ? childVal : parentVal;
};

mergeStrategy.el = mergeStrategy.propsData = defaultStrategy;

function mergeData(to: object, from?: object): object {
  if (!from) {
    return to;
  }

  const keys = Object.keys(from);

  for (let i = 0, key = keys[i]; i < keys.length; i++) {
    if (key === "__ob__") {
      continue;
    }

    if (!to.hasOwnProperty(key)) {
      to[key] = from[key];
    } else if (
      isPlainObject(to[key]) &&
      isPlainObject(from[key]) &&
      to[key] !== from[key]
    ) {
      mergeData(to[key], from[key]);
    }
  }

  return to;
}

function mergeDataOrFn(parentVal, childVal, vm?: Component): object {
  if (!vm) {
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }

    return function mergedDataFn() {
      return mergeData(
        typeof childVal === "function" ? childVal.call(this, this) : childVal,
        typeof parentVal === "function" ? parentVal.call(this, this) : parentVal
      );
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      const instanceData =
        typeof childVal === "function" ? childVal.call(vm, vm) : childVal;
      const defaultData =
        typeof parentVal === "function" ? parentVal.call(vm, vm) : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

mergeStrategy.data = (parentVal, childVal, vm?: Component): object => {
  return mergeDataOrFn(parentVal, childVal, vm);
};

function mergeHook(
  parentVal?: Array<Function>,
  childVal?: Function | Array<Function>
): Array<Function> {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal;
  return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

Object.keys(ComponentLifecycleName).forEach(hook => {
  mergeStrategy[hook] = mergeHook;
});
mergeStrategy.watch = function(parentVal?, childVal?): object {
  if (!childVal) {
    return parentVal;
  }
  if (!parentVal) {
    return childVal;
  }

  const ret = {};
  Object.assign(ret, parentVal);

  for (const key in childVal) {
    let parent = ret[key];
    const child = childVal[key];

    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child)
      ? child
      : [child];
  }

  return ret;
};
mergeStrategy.props = mergeStrategy.methods = mergeStrategy.computed = function(
  parentVal?: Object,
  childVal?: Object
): Object {
  if (!parentVal) return childVal;
  const ret = Object.create(null);
  Object.assign(ret, parentVal);
  if (childVal) Object.assign(ret, childVal);
  return ret;
};

export function mergeOptions(
  optParent: ICtorOpt,
  optChild: ICtorOpt,
  vm?: Component
) {
  const options = {};
  function mergeField(key) {
    const strategy = mergeStrategy[key] || defaultStrategy;
    options[key] = strategy(optParent[key], optChild[key], vm);
  }
  for (let p in optParent) {
    mergeField(p);
  }

  for (let p in optChild) {
    if (!optParent.hasOwnProperty(p)) {
      mergeField(p);
    }
  }

  return options;
}
