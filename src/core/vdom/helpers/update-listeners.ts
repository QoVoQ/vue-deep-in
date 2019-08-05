import {isDef} from "src/shared/util";
import {VNodeOn} from "../VNode";
import {IDOMListener, IFnToInvoke} from "../definition";
import {addListener, removeListener} from "src/web/runtime/modules/event";
import {Component} from "src/core/instance";

export function createFnInvoker(fn: Function, vm?: Component): IFnToInvoke {
  function invoker() {
    const fn = invoker.handler;
    fn.apply(vm, arguments);
  }
  invoker.handler = fn;
  return invoker;
}

export function updateListeners(
  on: VNodeOn,
  oldOn: VNodeOn,
  add: addListener,
  remove: removeListener,
  vm: Component
) {
  let eventName: string, curHandler: IDOMListener, oldHandler: IDOMListener;
  for (eventName in on) {
    curHandler = on[name];
    oldHandler = oldOn[name];

    if (!isDef(oldHandler)) {
      const invoker = createFnInvoker(curHandler.handler, vm);
      curHandler.fnToInvoke = invoker;
      add(eventName, invoker);
    } else if (curHandler !== oldHandler) {
      oldHandler.fnToInvoke.handler = curHandler.handler;
    }
  }

  for (eventName in oldOn) {
    if (!isDef(on[eventName])) {
      remove(eventName, oldOn[name].fnToInvoke);
    }
  }
}
