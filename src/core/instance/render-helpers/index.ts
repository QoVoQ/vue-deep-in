import Vue from "..";
import {renderSlot} from "./render-slot";
import {createTextVNode} from "src/core/vdom/VNode";

export function installRenderHelperFn(Ctor: typeof Vue) {
  Ctor.prototype._t = renderSlot;
  Ctor.prototype._v = createTextVNode;
}
