import {VNode} from "../vdom/VNode";
import {IDOMListener, VNodeOn} from "../vdom/definition";

type createElementFunction = (
  tag: string,
  data?: object,
  children?: Array<any> | any
) => VNode;
type renderFunction = (c: createElementFunction) => VNode;

interface ICtorUserOpt {
  props?: any;
  methods?: {[key: string]: Function};
  computed?: {[key: string]: Function};
  watch?: {
    [key: string]:
      | Function
      | string
      | {handler: Function; deep?: boolean; immediate?: boolean};
  };
  name?: string;
  el?: Element | string;
  components?: object;
  propsData?: object;
  data?: object | (() => object);

  render?: renderFunction;

  mixins?: ICtorOptions[];

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.created]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mounted]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroyed]?: Function | Function[];

  // user defined options
  [key: string]: any;
}

interface ICtorOptions extends ICtorUserOpt {
  parent?: Component;
  _propKeys?: string[];
  _componentTagName?: string;
  _parentListeners?: VNodeOn;

  // root vnode of a component, like <son/>,
  // vm.$options._parentVNode, vm.$vnode, childVNode.parent
  // it has attributes 'componentInstance' and 'componentOptions'
  _parentVNode?: VNode;
}
type Component = Vue;

import {vueProto_init, initMixin} from "./init";
import {vueProto$watch, stateMixin} from "./state";
import {
  vueProto_render,
  vueProto$nextTick,
  renderMixin,
  I$createElement
} from "./render";
import {
  vueProto$on,
  vueProto$emit,
  vueProto$off,
  vueProto$once,
  eventsMixin
} from "./events";
import {
  ComponentLifecycleName,
  vueProto$destroy,
  vueProto_update,
  vueProto$forceUpdate,
  lifecycleMixin
} from "./lifecycle";
import {Watcher, set, del, IWatcherOptions} from "../reactivity";
import {vueProto$mount, vueProto__patch__} from "src/web/runtime";
import {warn} from "src/shared/debug";
import {ctorExtend} from "../global-api/extend";

class Vue {
  static extend = ctorExtend;
  static cid = 0;
  static _base: typeof Vue;
  static options: Partial<ICtorUserOpt> & {_base?: typeof Vue};

  static super?: typeof Vue;
  _uid: number;

  _self: Vue;

  _vnode?: VNode;

  _events?: {[key: string]: Array<Function>};

  _c?: Function;

  _data?: object;

  _isBeingDestroyed: boolean;

  _isDestroyed: boolean;

  _isMounted: boolean;

  _isVue: boolean;

  _watcher?: Watcher;

  _watchers?: Array<Watcher>;

  $attr?: object;

  $children?: Array<Component>;

  $createElement?: createElementFunction;

  get $data(): any {
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
  $options?: Partial<ICtorOptions>;

  $parent?: Component;

  $root?: Component;

  $vnode?: VNode;
  _props: {};
  _computedWatchers: {[key: string]: Watcher};

  constructor(opts?: ICtorUserOpt) {
    this._init(opts);
  }

  _init: typeof vueProto_init;

  $on: typeof vueProto$on;
  $off: typeof vueProto$off;
  $emit: typeof vueProto$emit;
  $once: typeof vueProto$once;

  $mount: typeof vueProto$mount;

  _update: typeof vueProto_update;

  __patch__: typeof vueProto__patch__;

  _render: typeof vueProto_render;

  $nextTick: typeof vueProto$nextTick;
  $destroy: typeof vueProto$destroy;
  $forceUpdate: typeof vueProto$forceUpdate;

  $watch: typeof vueProto$watch;

  $set: typeof set;
  $delete: typeof del;
}
initMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
stateMixin(Vue);
export default Vue;

export {Vue, Component, ICtorUserOpt, ICtorOptions};
