import {isDef} from "src/shared/util";
import {IDOMListener, VNodeOn} from "../definition";
import {addListener, removeListener} from "src/web/runtime/modules/event";
import {Component} from "src/core/instance";

export function createFnInvoker(
  handler: IDOMListener,
  vm?: Component
): IDOMListener {
  if (handler.fnToInvoke) {
    return handler;
  }
  function invoker() {
    handler.apply(vm, arguments);
  }
  handler.fnToInvoke = invoker;
  return handler;
}

export function updateListeners(
  on: VNodeOn,
  oldOn: VNodeOn,
  add: addListener,
  remove: removeListener,
  vm: Component
) {
  for (const eventName in on) {
    const curHandlers = on[eventName];
    const oldHandlers = oldOn[eventName];

    // add new listeners
    if (!isDef(oldHandlers)) {
      curHandlers.forEach(handler => {
        createFnInvoker(handler, vm);
        add(eventName, handler.fnToInvoke);
      });
    } else {
      curHandlers.forEach(cur => {
        if (oldHandlers.indexOf(cur) === -1) {
          createFnInvoker(cur, vm);
          add(eventName, cur.fnToInvoke);
        }
      });
    }
  }

  // remove old listeners
  for (const eventName in oldOn) {
    if (!isDef(on[eventName])) {
      oldOn[eventName].forEach(old => {
        remove(eventName, old.fnToInvoke);
      });
    } else {
      oldOn[eventName].forEach(old => {
        if (on[eventName].indexOf(old) === -1) {
          remove(eventName, old.fnToInvoke);
        }
      });
    }
  }
}
