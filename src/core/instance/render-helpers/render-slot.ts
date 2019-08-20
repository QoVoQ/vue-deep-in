import {VNode} from "src/core/vdom/VNode";
import Vue from "src";
import {normalizeChildren} from "src/core/vdom/create-element";

export function renderSlot(
  this: Vue,
  slotName: string | number,
  slotChildren?: any[]
): VNode[] {
  return this.$slots[slotName] || normalizeChildren(slotChildren);
}
