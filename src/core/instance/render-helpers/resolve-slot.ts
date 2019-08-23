import {VNode} from "src/core/vdom/VNode";
import {Component} from "src";
import {isDef, getByPath} from "src/shared/util";

export type SlotsMap = {[key: string]: VNode[]} | {};
export type ScopedSlotMap = {[key: string]: (attrs: any) => VNode | VNode[]};
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
    let slotName: string | number = "default";
    if (child.context === parentCtx && isDef(getByPath(childData, ["slot"]))) {
      slotName = childData.slot;
    }
    res[slotName] = res[slotName] || [];
    res[slotName].push(child);
  });

  return res;
}
