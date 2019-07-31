import Vue, {componentOptions, Component} from ".";
import {initEvents} from "./events";
import {initLifecycle, callHook, ComponentLifecycleName} from "./lifecycle";
import {initRender} from "./render";
import {initState} from "./state";

let uid = 0;
export function initMixin(ctor: typeof Vue) {
  ctor.prototype._init = function(opt: componentOptions) {
    const vm: Component = this;
    vm.$options = opt;
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
}
