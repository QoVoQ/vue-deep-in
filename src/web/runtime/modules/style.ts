import {getStyle, normalizeStyleBinding} from "src/web/util/style";
import {isDef} from "src/shared/util";
import {VNode} from "src/core/vdom/VNode";
import {VNodeHookNames} from "./definition";

const setProp = (el: HTMLElement, name: string, val) => {
  if (Array.isArray(val)) {
    // Support values array created by autoprefixer, e.g.
    // {display: ["-webkit-box","flex"]}
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

  if (!isDef(data.style) && !isDef(oldData.style)) {
    return;
  }

  const el = vnode.elm as HTMLElement;

  const oldStyle = oldData.normalizedStyle || oldData.style || {};

  const style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? Object.assign({}, style)
    : style;

  const newStyle = getStyle(vnode, true);

  // remove old style
  for (const name in oldStyle) {
    if (!isDef(newStyle[name])) {
      setProp(el, name, "");
    }
  }

  // add new style
  for (const name in newStyle) {
    const cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      setProp(el, name, cur);
    }
  }
}

export default {
  [VNodeHookNames.create]: updateStyle,
  [VNodeHookNames.update]: updateStyle
};
