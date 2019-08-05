import {VNode} from "../vdom/VNode";
import {IDOMListener} from "../vdom/definition";

type createElementFunction = (
  tag: string,
  data: object,
  children: Array<VNode | string>
) => VNode;
type renderFunction = (c: createElementFunction) => VNode;

interface ICtorOptions {
  props?: any;
  methods?: {[key: string]: Function};
  computed?: {[key: string]: Function};
  watch?: {[key: string]: Function};
  name?: string;
  el?: Element | string;
  parent?: Component;

  components?: object;
  propsData?: object;
  data?: () => object;

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.created]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mounted]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroyed]?: Function | Function[];
  render: renderFunction;
  _propKeys?: string[];
  _componentTagName?: string;
  _parentListeners?: {[key: string]: IDOMListener};

  // root vnode of a component, like <son/>,
  // vm.$options._parentVNode, vm.$vnode, childVNode.parent
  // it has attributes 'componentInstance' and 'componentOptions'
  _parentVNode?: VNode;
}
type Component = Vue;

import {vueProto_init} from "./init";
import {vueProto$watch} from "./state";
import {vueProto_render, vueProto$nextTick} from "./render";
import {
  vueProto$on,
  vueProto$emit,
  vueProto$off,
  vueProto$once
} from "./events";
import {
  ComponentLifecycleName,
  vueProto$destroy,
  vueProto_update,
  vueProto$forceUpdate
} from "./lifecycle";
import {Watcher, set, del} from "../reactivity";
import {vueProto$mount, vueProto__patch__} from "src/web/runtime";
import {warn} from "src/shared/debug";

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

  get $data() {
    return this._data;
  }
  set $data(_) {
    warn(
      "Avoid replacing instance root $data. Use nested data properties instead."
    );
  }

  get $props() {
    return this._props;
  }

  set $props(_) {
    warn("$props is readonly");
  }
  $el?: Element;
  $options?: ICtorOptions;

  $parent?: Component;

  $root?: Component;

  $vnode?: VNode;
  _props: {};
  _computedWatchers: {[key: string]: Watcher};

  constructor(opts: ICtorOptions) {
    this._init(opts);
  }

  _init = vueProto_init;

  $on = vueProto$on;
  $off = vueProto$off;
  $emit = vueProto$emit;
  $once = vueProto$once;

  $mount = vueProto$mount;

  _update = vueProto_update;

  __patch__ = vueProto__patch__;

  _render = vueProto_render;

  $nextTick = vueProto$nextTick;
  $destroy = vueProto$destroy;
  $forceUpdate = vueProto$forceUpdate;

  $watch = vueProto$watch;

  $set = set;
  $delete = del;
}

export default Vue;

export {Vue, Component, ICtorOptions};
