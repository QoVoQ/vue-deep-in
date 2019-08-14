/* @flow */
import {isDef} from "src/shared/util";
import {VNode} from "src/core/vdom/VNode";
import {isFalsyAttrValue} from "src/web/util";
import {VNodeHookNames} from "./definition";

function updateAttrs(oldVnode: VNode, vnode: VNode) {
  if (!isDef(oldVnode.data.attrs) && !isDef(vnode.data.attrs)) {
    return;
  }
  let key, cur, old;
  const elm = vnode.elm as Element;
  const oldAttrs = oldVnode.data.attrs || {};
  let attrs: any = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  // @todo don't know why
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = Object.assign({}, attrs);
  }

  // add new attrs
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }

  // remove old attrs
  for (key in oldAttrs) {
    if (!isDef(attrs[key])) {
      setAttr(elm, key, false);
    }
  }
}

function setAttr(el: Element, key: string, value: any) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    if (key === "disabled") {
      el.setAttribute(key, "disabled");
    } else {
      el.setAttribute(key, value);
    }
  }
}

export default {
  [VNodeHookNames.create]: updateAttrs,
  [VNodeHookNames.update]: updateAttrs
};
