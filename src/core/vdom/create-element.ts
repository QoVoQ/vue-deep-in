import {VNode, createEmptyVNode, createTextVNode} from "./VNode";
import {IVNodeData} from "./definition";
import {isDef, isObject} from "src/shared/util";
import Vue, {Component, ICtorUserOpt} from "../instance";
import {warn} from "src/shared/debug";
import {createComponent} from "./create-component";

export function createElement(
  context: Component,
  tag: string | typeof Vue,
  data?: IVNodeData,
  children?: Array<any> | any
): VNode {
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }

  let vnode: VNode, Ctor: Partial<ICtorUserOpt> | typeof Vue;
  if (typeof tag === "string") {
    if ((Ctor = context.$options.components[tag])) {
      vnode = createComponent(
        Ctor,
        context,
        tag,
        data,
        normalizeChildren(children)
      );
    } else {
      vnode = new VNode(
        tag,
        data,
        normalizeChildren(children),
        undefined,
        undefined,
        context
      );
    }
  } else if ((tag as typeof Vue).options) {
    vnode = createComponent(
      tag,
      context,
      tag.options.name,
      data,
      normalizeChildren(children)
    );
  } else {
    warn(
      `createElement: Parameter tag should be type of string or component constructor, but got ${tag}`
    );
  }
  if (isDef(vnode)) {
    // if (isDef(data)) registerDeepBindings(data);
    return vnode;
  } else {
    return createEmptyVNode();
  }
}
// @TODO can be remove???
// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
// function registerDeepBindings(data) {
//   if (isObject(data.style)) {
//     traverse(data.style);
//   }
//   if (isObject(data.class)) {
//     traverse(data.class);
//   }
// }

export function normalizeChildren(children: any[]): VNode[] {
  return Array.isArray(children)
    ? children.reduce((acc, cur) => {
        if (Array.isArray(cur)) {
          return acc.concat(normalizeChildren(cur));
        } else {
          const vnode = cur instanceof VNode ? cur : createTextVNode(cur);
          return acc.concat(vnode);
        }
      }, [])
    : isDef(children)
    ? [createTextVNode(children)]
    : [];
}
