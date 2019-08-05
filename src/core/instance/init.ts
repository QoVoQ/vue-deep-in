import Vue, {ICtorOptions, Component} from ".";
import {initEvents} from "./events";
import {initLifecycle, callHook, ComponentLifecycleName} from "./lifecycle";
import {initRender} from "./render";
import {initState} from "./state";
import {isDef} from "src/shared/util";

let uid = 0;
export const vueProto_init = function(opt: ICtorOptions) {
  const vm: Component = this;
  vm.$options = {
    ...opt,
    data: () => (isDef(opt.data) ? opt.data.apply(vm) : {})
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
