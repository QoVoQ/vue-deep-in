import Vue, {ICtorUserOpt, Component} from ".";
import {initEvents} from "./events";
import {initLifecycle, callHook, ComponentLifecycleName} from "./lifecycle";
import {initRender} from "./render";
import {initState} from "./state";
import {isDef} from "src/shared/util";

let uid = 0;
export const vueProto_init = function(opt: ICtorUserOpt) {
  const vm: Component = this;
  vm.$options = {
    ...opt,
    data: isDef(opt.data)
      ? typeof opt.data === "function"
        ? opt.data.apply(vm)
        : opt.data
      : {}
  };
  vm._uid = uid++;

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
