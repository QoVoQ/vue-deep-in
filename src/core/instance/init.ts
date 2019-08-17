import Vue, {
  ICtorUserOpt,
  Component,
  ICtorOptions,
  IInternalComponentOptions
} from ".";
import {initEvents} from "./events";
import {initLifecycle, callHook, ComponentLifecycleName} from "./lifecycle";
import {initRender} from "./render";
import {initState} from "./state";
import {isDef} from "src/shared/util";
import {mergeOptions} from "../util/options";

let uid = 0;
export const vueProto_init = function(opt?: Partial<ICtorOptions>) {
  const vm: Component = this;
  vm._isVue = true;
  vm._uid = uid++;

  if (opt && opt._isComponent) {
    initInternalComponent(vm, opt as IInternalComponentOptions);
  } else {
    vm.$options = mergeOptions(
      resolveCtorOptions(Object.getPrototypeOf(vm).constructor),
      opt || {},
      vm
    );
  }

  vm._self = vm;
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  callHook(vm, ComponentLifecycleName.beforeCreate);
  initState(vm);
  callHook(vm, ComponentLifecycleName.created);
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};

export function initMixin(Ctor: typeof Vue) {
  Ctor.prototype._init = vueProto_init;
}

function resolveCtorOptions(Ctor: typeof Vue): Partial<ICtorUserOpt> {
  return Ctor.options || {};
}

function initInternalComponent(
  vm: Component,
  options: IInternalComponentOptions
) {
  const vmOpts: ICtorOptions = (vm.$options = Object.create(
    (vm.constructor as typeof Vue).options
  ));

  const parentVnode = (vmOpts._parentVnode = options._parentVnode);
  vmOpts.parent = options.parent;

  const {propsData, listeners, tag, children} = parentVnode.componentOptions;
  vmOpts.propsData = propsData;
  vmOpts._parentListeners = listeners;
  vmOpts._componentTagName = tag;
  // related to slot
  vmOpts._renderChildren = children;

  if (options.render) {
    vmOpts.render = options.render;
    vmOpts.staticRenderFns = options.staticRenderFns;
  }
}
