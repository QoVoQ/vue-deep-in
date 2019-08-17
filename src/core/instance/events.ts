import Vue, {Component} from ".";
import {isDef, arrayRemove} from "src/shared/util";
import {invokeWithErrorHandler} from "../util/error";
import {updateListeners} from "../vdom/helpers/update-listeners";
import {addListener, removeListener} from "src/web/runtime/modules/event";
import {VNodeOn} from "../vdom/definition";

export function initEvents(vm: Component) {
  vm._events = Object.create(null);
  // init listener
  const listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners, undefined);
  }
}

export function eventsMixin(Ctor: typeof Vue) {
  Ctor.prototype.$on = vueProto$on;
  Ctor.prototype.$off = vueProto$off;
  Ctor.prototype.$emit = vueProto$emit;
  Ctor.prototype.$once = vueProto$once;
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
  newOn: VNodeOn = {},
  oldOn: VNodeOn = {}
) {
  target = vm;
  updateListeners(newOn, oldOn, add, remove, vm);
  target = null;
}
/**
 * this.$('on', fn)
 */
export const vueProto$on = function(name: string, handler: Function) {
  const eventQue = this._events[name] || (this._events[name] = []);
  eventQue.push(handler);
};

/**
 * this.$off()
 * this.$off('test')
 * this.$off('test', fn)
 */
interface I$off {
  (): void;
  (name: string): void;
  (name: string, handler: Function): void;
}
export const vueProto$off: I$off = function(name?: string, handler?: Function) {
  if (!isDef(name)) {
    this._events = Object.create(null);
    return;
  }
  const eventQue = this._events[name];

  if (!isDef(handler)) {
    this._events[name] = null;
    return;
  }

  if (!isDef(eventQue)) {
    return;
  }
  // compare ele.handler for $once
  arrayRemove(eventQue, ele => ele === handler || ele.handler === handler);
};

/**
 * this.$emit('test', a,b,c)
 */
export const vueProto$emit = function(name: string, ...args: Array<any>) {
  const eventQue = this._events[name];

  if (!isDef(eventQue)) {
    return;
  }

  eventQue.forEach(fn => {
    invokeWithErrorHandler(fn, this, args);
  });
};

/**
 * this.$once('test', fn)
 */
export const vueProto$once = function(name: string, handler: Function) {
  const vm = this;
  function once(...args) {
    vm.$off(name, once);
    invokeWithErrorHandler(handler, vm, args);
  }
  // in order to can be found when $off
  once.handler = handler;

  this.$on(name, once);
};
