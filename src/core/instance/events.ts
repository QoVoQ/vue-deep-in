import Vue, {Component} from ".";
import {isDef} from "src/shared/util";
import {invokeWithErrorHandler} from "../util/error";
import {updateListeners} from "../vdom/helpers/update-listeners";
import {addListener, removeListener} from "src/web/runtime/modules/event";
import {VNodeOn} from "../vdom/VNode";

export function initEvents(vm: Component) {
  vm._events = Object.create(null);
  // init listener
  const listeners = this.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners, undefined);
  }
}

let target = null;

const add: addListener = (name, fn) => {
  target.$on(name, fn);
};
const remove: removeListener = (name, fn) => {
  target.$off(name, fn);
};

export function updateComponentListeners(
  vm: Component,
  newOn: VNodeOn,
  oldOn: VNodeOn
) {
  target = vm;
  updateListeners(newOn, oldOn, add, remove, vm);
  target = null;
}

export const vueProto$on = function(name: string, handler: Function) {
  const eventQue = this._events[name] || (this._events[name] = []);
  eventQue.push(handler);
};

export const vueProto$off = function(name?: string, handler?: Function) {
  const eventQue = this._events[name];
  if (!isDef(name)) {
    this._events = Object.create(null);
  }

  if (!isDef(handler)) {
    this._events[name] = null;
    return;
  }

  if (!isDef(eventQue)) {
    return;
  }

  const idx = eventQue.findIndex(handler);
  if (idx === -1) {
    return;
  }

  eventQue.splice(idx, 1);
};

export const vueProto$emit = function(name: string, ...args: Array<any>) {
  const eventQue = this._events[name];

  if (!isDef(eventQue)) {
    return;
  }

  eventQue.forEach(fn => {
    invokeWithErrorHandler(fn, this, args);
  });
};

export const vueProto$once = function(name: string, handler: Function) {
  const vm = this;
  function once(...args) {
    vm.$off(name, once);
    invokeWithErrorHandler(handler, vm, args);
  }

  this.$on(name, once);
};
