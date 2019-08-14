import {toObject} from "src/shared/util";
import {VNode} from "src/core/vdom/VNode";
import {IVNodeData} from "src/core/vdom/definition";

function normalizeStyleData(data: IVNodeData) {
  const style = normalizeStyleBinding(data.style);
  return style;
}

// normalize possible array values into Object
export function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  return bindingStyle;
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
export function getStyle(vnode: VNode, checkChild: boolean): Object {
  const res = {};
  let styleData;
  // @TODO don't know why, may be related to component mechanism
  if (checkChild) {
    let childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode &&
        childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        Object.assign(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    Object.assign(res, styleData);
  }

  let parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      Object.assign(res, styleData);
    }
  }
  return res;
}
