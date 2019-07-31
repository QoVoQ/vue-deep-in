import Vue, {Component} from ".";
import {invokeWithErrorHandler} from "../util/error";

export enum ComponentLifecycleName {
  beforeCreate = "BEFORE_CREATE",
  created = "CREATED",
  beforeMount = "BEFORE_MOUNT",
  mounted = "MOUNTED",
  beforeDestroy = "BEFORE_DESTROY",
  destroyed = "DESTROYED"
}
export function lifecycleMixin(c: typeof Vue) {}

export function initLifecycle(vm: Component) {}

export function callHook(vm: Component, hookName: ComponentLifecycleName) {
  let fns = vm.$options[hookName];
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach(fn => {
    invokeWithErrorHandler(fn, vm, undefined, `lifecycle hook: ${hookName}`);
  });
}
