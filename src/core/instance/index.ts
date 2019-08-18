import {VNode} from "../vdom/VNode";
import {VNodeOn} from "../vdom/definition";

type renderFunction = (c: I$createElement) => VNode | VNode[];

type propsOptions = {[key: string]: {type: Function[]}};

interface ICtorUserOpt {
  props?: propsOptions;
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
  components?: {[key: string]: ICtorUserOpt | typeof Vue};
  propsData?: object;
  data?: object | (() => object);

  render?: renderFunction;

  mixins?: Partial<ICtorOptions>[];

  [ComponentLifecycleName.beforeCreate]?: Function | Function[];
  [ComponentLifecycleName.created]?: Function | Function[];
  [ComponentLifecycleName.beforeMount]?: Function | Function[];
  [ComponentLifecycleName.mounted]?: Function | Function[];
  [ComponentLifecycleName.beforeDestroy]?: Function | Function[];
  [ComponentLifecycleName.destroyed]?: Function | Function[];

  // user defined options
  [key: string]: any;
}
interface IInternalComponentOptions {
  _isComponent: true;
  parent: Component;
  // root vnode of a component, like <son/>,
  // vm.$options._parentVnode, vm.$vnode, childVNode.parent
  // it has attributes 'componentInstance' and 'componentOptions'
  _parentVnode: VNode;

  // related to slot
  render?: renderFunction;
  staticRenderFns?: Array<Function>;
}
interface ICtorOptions extends ICtorUserOpt, IInternalComponentOptions {
  _propKeys?: string[];
  _componentTagName?: string;
  _parentListeners?: VNodeOn;
  _renderChildren?: VNode[];
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
import {Watcher, set, del} from "../reactivity";
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
  // vnode of current mounted element
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

  $attrs?: object;

  $listeners?: object;

  $children?: Array<Component>;

  $createElement?: I$createElement;

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
  $options?: Partial<ICtorUserOpt> & {_base?: typeof Vue};

  $parent?: Component;

  $root?: Component;

  $vnode?: VNode;
  _props: {};
  _computedWatchers: {[key: string]: Watcher};

  constructor(opts?: Partial<ICtorOptions>) {
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

export {
  Vue,
  Component,
  ICtorUserOpt,
  ICtorOptions,
  propsOptions,
  IInternalComponentOptions
};
