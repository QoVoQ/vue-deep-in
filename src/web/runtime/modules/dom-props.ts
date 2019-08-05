/* @flow */

import {isDef} from "src/shared/util";
import {VNode} from "src/core/vdom/VNode";
import {VNodeHookNames} from "./definition";

function updateDOMProps(oldVnode: VNode, vnode: VNode) {
  if (!isDef(oldVnode.data.domProps) && !isDef(vnode.data.domProps)) {
    return;
  }
  let key, cur;
  const elm: any = vnode.elm;
  const oldProps = oldVnode.data.domProps || {};
  let props: any = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = Object.assign({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = "";
    }
  }

  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === "textContent" || key === "innerHTML") {
      if (vnode.children) vnode.children.length = 0;
      if (cur === oldProps[key]) continue;
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === "value") {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      const strCur = !isDef(cur) ? "" : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (
      // skip the update if old and new VDOM state is the same.
      // `value` is handled separately because the DOM value may be temporarily
      // out of sync with VDOM state due to focus, composition and modifiers.
      // This  #4521 by skipping the unnecessary `checked` update.
      cur !== oldProps[key]
    ) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
}

type acceptValueElm = HTMLInputElement;

function shouldUpdateValue(elm: acceptValueElm, newVal: string) {
  const oldVal = elm.value;
  return oldVal !== newVal;
}

export default {
  [VNodeHookNames.create]: updateDOMProps,
  [VNodeHookNames.update]: updateDOMProps
};
