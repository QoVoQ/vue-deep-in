import {VNode} from "src/core/vdom/VNode";
import Vue from "src";
import {normalizeChildren} from "src/core/vdom/create-element";

export function renderSlot(
  this: Vue,
  slotName: string | number,
  slotChildren?: any[], // default content
  bindAttrs?: any
): VNode[] {
  if (this.$scopedSlots[slotName]) {
    const params = {...bindAttrs};
    return normalizeChildren(this.$scopedSlots[slotName].call(this, params));
  } else {
    return this.$slots[slotName] || normalizeChildren(slotChildren);
  }
}
