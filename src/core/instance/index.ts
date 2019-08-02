import {VNode, IDOMListener} from "../vdom/VNode";

type createElementFunction = (
  tag: string,
  data: object,
  children: Array<VNode>
) => VNode;
type renderFunction = (c: createElementFunction) => VNode;

interface IComponentOptions {
  _propKeys: any[];
  props: any;
  methods: {[key: string]: Function};
  computed: {[key: string]: Function};
  watch: {[key: string]: Function};
  name?: string;
  el?: Element;

  parent?: Component;
  component?: object;

  propsData?: object;
  data?: () => object;
  method?: {[key: string]: Function};

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.created]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mounted]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroyed]?: Function | Function[];
  render: renderFunction;

  _componentTagName?: string;
  _parentListeners?: {[key: string]: IDOMListener};

  // root vnode of a component, like <son/>,
  // vm.$options._parentVNode, vm.$vnode, childVNode.parent
  // it has attributes 'componentInstance' and 'componentOptions'
  _parentVNode?: VNode;

  _propsKeys: Array<string>;
}
type Component = Vue;

import {initMixin} from "./init";
import {stateMixin} from "./state";
import {renderMixin} from "./render";
import {eventsMixin} from "./events";
import {lifecycleMixin, ComponentLifecycleName} from "./lifecycle";
import {Watcher} from "../reactivity";

class Vue {
  _uid: number;

  _self: Vue;

  _vnode?: VNode;

  _events?: {[key: string]: Array<Function>};

  _c?: Function;

  _data?: object;

  _isBeingDestroyed: boolean = false;

  _isDestroyed: boolean = false;

  _isMounted: boolean = false;

  _isVue: boolean = true;

  _watcher?: Watcher;

  _watchers?: Array<Watcher>;

  $attr?: object;

  $children?: Array<Component>;

  $createElement?: Function;

  $data?: object;

  $props?: object;
  $el?: Element;
  $options?: IComponentOptions;

  $parent?: Component;

  $root?: Component;

  $vnode?: VNode;
  _props: {};
  _computedWatchers: {[key: string]: Watcher};

  constructor(opts: IComponentOptions) {
    this._init(opts);
  }

  _init(opts: IComponentOptions) {}

  $on(eventName: string, handler: Function) {}
  $off(eventName?: string, handler?: Function) {}

  $emit(eventName: string, ...args: Array<any>) {}
  $once(eventName: string, handler: Function) {}

  $mount(el?: Element) {}

  _update(vnode: VNode) {}

  __patch__(oldNode: Element | VNode, newNode: VNode): Element {
    return document.createElement("div");
  }

  _render(): VNode {
    return new VNode();
  }

  $nextTick(fn: Function) {}
  $destroy() {}
  $forceUpdate() {}

  $watch(expOrFn: string | Function, handler: any, options: Object) {
    throw new Error("Method not implemented.");
  }

  $set(target: object, key: string | number, val: any) {
    throw new Error("Method not implemented.");
  }
  $delete(target: object, key: string | number) {
    throw new Error("Method not implemented.");
  }
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;

export {Vue, Component, IComponentOptions};
