import Vue, {Component} from ".";
import {VNode, createEmptyVNode} from "../vdom/VNode";
import {warn} from "src/shared/debug";
import {createElement} from "../vdom/create-element";
import {defineReactivity} from "../reactivity";

export function renderMixin(ctor: typeof Vue) {
  ctor.prototype.$nextTick = function(fn: Function) {
    //@ TODO
    return fn.call(this);
  };

  ctor.prototype._render = function(): VNode {
    const vm: Component = this;
    const {render, _parentVNode} = vm.$options;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    // like vnode tag <component-son-1 />
    vm.$vnode = _parentVNode;
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
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      warn("Abnormal nodes returned from render function.", vm);
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVNode;
    return vnode;
  };
}

export function initRender(vm: Component) {
  vm._vnode = null; // the root of the child tree
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVNode); // the placeholder node in parent tree
  // @TODO fn _c deletable??
  vm._c = (a, b, c) => createElement(vm, a, b, c);

  vm.$createElement = (a, b, c) => createElement(vm, a, b, c);

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  const parentData = parentVnode && parentVnode.data;

  defineReactivity(vm, "$attrs", (parentData && parentData.attrs) || {});
  defineReactivity(vm, "$listeners", options._parentListeners || {});
}
