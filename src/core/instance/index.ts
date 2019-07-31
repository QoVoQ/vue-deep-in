import {VNode, IDOMListener} from "../vdom/VNode";

type createElementFunction = (
  tag: string,
  data: object,
  children: Array<VNode>
) => VNode;
type renderFunction = (c: createElementFunction) => VNode;

interface componentOptions {
  name?: string;
  el: HTMLElement;
  data?: () => object;
  method?: {[key: string]: Function};

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.create]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mount]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroy]?: Function | Function[];
  render: renderFunction;

  _parentListeners?: {[key: string]: IDOMListener};
}
type Component = Vue;

import {initMixin} from "./init";
import {stateMixin} from "./state";
import {renderMixin} from "./render";
import {eventsMixin} from "./events";
import {lifecycleMixin, ComponentLifecycleName} from "./lifecycle";

class Vue {
  _uid: number;

  _self: Vue;
  _vnode?: VNode;

  _events?: {[key: string]: Array<Function>};

  $options?: componentOptions;

  constructor(opts: componentOptions) {
    this._init(opts);
  }

  _init(opts: componentOptions) {}

  $on(eventName: string, handler: Function) {}
  $off(eventName: string, handler?: Function) {}

  $emit(eventName: string, ...args: Array<any>) {}
  $once(eventName: string, handler: Function) {}

  $mount(el?: HTMLElement) {}
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;

export {Vue, Component, componentOptions};
