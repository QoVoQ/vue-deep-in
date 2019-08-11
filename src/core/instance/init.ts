import Vue, {ICtorUserOpt, Component} from ".";
import {initEvents} from "./events";
import {initLifecycle, callHook, ComponentLifecycleName} from "./lifecycle";
import {initRender} from "./render";
import {initState} from "./state";
import {isDef} from "src/shared/util";
import {mergeOptions} from "../util/options";

let uid = 0;
export const vueProto_init = function(opt?: ICtorUserOpt) {
  const vm: Component = this;
  vm._isVue = true;
  vm._uid = uid++;

  vm.$options = mergeOptions(
    resolveCtorOptions(Object.getPrototypeOf(vm).constructor),
    opt || {},
    vm
  );

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
