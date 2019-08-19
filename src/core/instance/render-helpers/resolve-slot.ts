import {VNode} from "src/core/vdom/VNode";
import {Component} from "src";

export type SlotsMap = {[key: string]: VNode[]} | {};
export function resolveSlot(
  renderChildren?: VNode[],
  parentCtx?: Component
): SlotsMap {
  const res = {};
  if (!renderChildren || !parentCtx) {
    return res;
  }
  /**
   * <Comp><p slot="hi">Say hi</p></Comp>
   */
  renderChildren.forEach(child => {
    const childData = child.data;
    if (child.context === parentCtx) {
      const slotName = childData.slot || "default";
      res[slotName] = res[slotName] || [];
      res[slotName].push(child);
    }
  });

  return res;
}
