import {VNode} from "src/core/vdom/VNode";
import Vue from "..";
import {isPlainObject} from "src/shared/util";

export function renderList(
  this: Vue,
  arr,
  renderFn: (ele, keyOrIdx, idx?) => VNode
): VNode[] {
  if (Array.isArray(arr)) {
    return arr.map(renderFn, this);
  } else if (typeof arr === "number") {
    let i = 0;
    const res = [];
    while (i < arr) {
      res[i] = renderFn(i + 1, i);
      i++;
    }
    return res;
  } else if (isPlainObject(arr)) {
    return Object.entries(arr).map(([key, val], idx) =>
      renderFn(val, key, idx)
    );
  } else {
    return [];
  }
}
