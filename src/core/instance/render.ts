import Vue, {Component, ICtorOptions} from ".";
import {VNode, createEmptyVNode, IVNodeData} from "../vdom/VNode";
import {warn} from "src/shared/debug";
import {createElement} from "../vdom/create-element";
import {defineReactivity} from "../reactivity";
import {nextTick} from "../util/next-tick";
import {resolveSlot} from "./render-helpers/resolve-slot";
import {getByPath} from "src/shared/util";

export function vueProto$nextTick(fn?: Function) {
  return nextTick(fn, this);
}

export function vueProto_render(): VNode {
  const vm: Component = this;
  const {render, _parentVnode} = vm.$options;

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  // like vnode tag <component-son-1 />
  vm.$vnode = _parentVnode;

  // render self
  let vnode;
  try {
    vnode = render.call(vm, vm.$createElement);
  } catch (e) {
    warn(
      `Exception in component(${vm.$options.name})'s render function: `,
      vm,
      e
    );
    vnode = vm._vnode;
  }
  // if the returned array contains only a single node, allow it
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }
  // return empty vnode in case the render function error out
  if (!(vnode instanceof VNode)) {
    warn("Abnormal nodes returned from render function.", vm);
    vnode = createEmptyVNode();
  }
  // set parent
  vnode.parent = _parentVnode;
  return vnode;
}

export interface I$createElement {
  (tag?: string | typeof Vue, data?: IVNodeData, children?: any): VNode;
}

export function renderMixin(Ctor: typeof Vue) {
  Ctor.prototype.$nextTick = vueProto$nextTick;
  Ctor.prototype._render = vueProto_render;
}

export function initRender(vm: Component) {
  vm._vnode = null; // the root of the child tree
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree

  vm.$slots = resolveSlot(
    options._renderChildren,
    getByPath(parentVnode, ["context"])
  );
  vm.$scopedSlots = getByPath(parentVnode, ["data", "scopedSlots"]) || {};
  const renderFn: I$createElement = (a, b, c?) => createElement(vm, a, b, c);
  vm.$createElement = renderFn;

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOC using them are always updated
  const parentData = getByPath(parentVnode, ["data"]);

  defineReactivity(vm, "$attrs", getByPath(parentData, ["attrs"]) || {});
  defineReactivity(vm, "$listeners", options._parentListeners || {});
}
