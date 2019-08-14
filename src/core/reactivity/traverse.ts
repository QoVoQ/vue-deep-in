import {VNode} from "../vdom/VNode";
import {isObject} from "util";
import {IObserved} from "./Observer";

const seenObjects: Set<number> = new Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse(val: IObserved) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val: IObserved, seen: Set<number>) {
  const isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || val instanceof VNode) {
    return;
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.uid;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    let i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    const keys = Object.keys(val);
    let i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}
