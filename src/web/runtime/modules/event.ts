/* @flow */

import {isDef} from "src/shared/util";
import {updateListeners} from "src/core/vdom/helpers/update-listeners";
import {VNode} from "src/core/vdom/VNode";
import {VNodeHookNames} from ".";
// @todo: why use a local target?
let target: any;
type addListener = (name: string, fn: Function) => void;

function add(name: string, handler: Function) {
  target.addEventListener(name, handler);
}

type removeListener = (name: string, fn: Function, target?: Element) => void;

function remove(name: string, handler: Function, _target?: Element) {
  (_target || target).removeEventListener(name, handler);
}

function updateDOMListeners(oldVnode: VNode, vnode: VNode) {
  if (!isDef(oldVnode.data.on) && !isDef(vnode.data.on)) {
    return;
  }
  const on = vnode.data.on || {};
  const oldOn = oldVnode.data.on || {};
  target = vnode.elm;
  updateListeners(on, oldOn, add, remove, vnode.context);
  target = undefined;
}

export default {
  [VNodeHookNames.create]: updateDOMListeners,
  [VNodeHookNames.update]: updateDOMListeners
};

export {addListener, removeListener};
