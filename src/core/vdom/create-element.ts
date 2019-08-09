import {VNode, createEmptyVNode, createTextVNode} from "./VNode";
import {IVNodeData} from "./definition";
import {isDef, isObject} from "src/shared/util";
import Vue, {Component} from "../instance";
import {traverse} from "../reactivity/traverse";

export function createElement(
  context: Component,
  tag?: string | typeof Vue,
  data?: IVNodeData,
  children?: Array<any>
): VNode {
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }

  let vnode;
  if (typeof tag === "string") {
    vnode = new VNode(
      tag,
      data,
      normalizeChildren(children),
      undefined,
      undefined,
      context
    );

    if (isDef(vnode)) {
      if (isDef(data)) registerDeepBindings(data);
      return vnode;
    } else {
      return createEmptyVNode();
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

function normalizeChildren(children: any[]): VNode[] {
  return Array.isArray(children)
    ? children.reduce((acc, cur) => {
        const vnode = cur instanceof VNode ? cur : createTextVNode(cur);
        return acc.concat(vnode);
      }, [])
    : [];
}
