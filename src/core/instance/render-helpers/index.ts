import Vue from "..";
import {renderSlot} from "./render-slot";
import {createTextVNode, createEmptyVNode} from "src/core/vdom/VNode";
import {renderList} from "./render-list";

export function installRenderHelperFn(Ctor: typeof Vue) {
  Ctor.prototype._t = renderSlot;
  Ctor.prototype._v = createTextVNode;
  Ctor.prototype._e = createEmptyVNode;
  Ctor.prototype._l = renderList;
}
