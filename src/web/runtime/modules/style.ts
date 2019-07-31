/* @flow */

import {getStyle, normalizeStyleBinding} from "src/web/util/style";
import {cached, isDef} from "src/shared/util";
import {VNode} from "src/core/vdom/VNode";

const cssVarRE = /^--/;
const importantRE = /\s*!important$/;
const setProp = (el, name, val) => {
  if (Array.isArray(val)) {
    // Support values array created by autoprefixer, e.g.
    // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
    // Set them one by one, and the browser will only set those it can recognize
    for (let i = 0, len = val.length; i < len; i++) {
      el.style[name] = val[i];
    }
  } else {
    el.style[name] = val;
  }
};

function updateStyle(oldVnode: VNode, vnode: VNode) {
  const data = vnode.data;
  const oldData = oldVnode.data;

  if (
    !isDef(data.staticStyle) &&
    !isDef(data.style) &&
    !isDef(oldData.staticStyle) &&
    !isDef(oldData.style)
  ) {
    return;
  }

  let cur, name;
  const el: any = vnode.elm;
  const oldStaticStyle: any = oldData.staticStyle;
  const oldStyleBinding: any = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  const oldStyle = oldStaticStyle || oldStyleBinding;

  const style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? Object.assign({}, style)
    : style;

  const newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (!isDef(newStyle[name])) {
      setProp(el, name, "");
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      setProp(el, name, cur);
    }
  }
}

export default {
  create: updateStyle,
  update: updateStyle
};
