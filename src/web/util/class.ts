import {VNode} from "src/core/vdom/VNode";
import {IVNodeData} from "src/core/vdom/definition";
import {isDef, isObject} from "src/shared/util";

// const vnode = new VNode("p", {
//   class: [
//     { class1: false, class2: true, class3: false },
//     "class4",
//     ["class5", "class6"]
//   ]
// });
type DOMClassPrimitive = string;
type DOMClassMap = {[key: string]: boolean};
type DOMClassArray = Array<
  DOMClassPrimitive | DOMClassMap | Array<DOMClassPrimitive | DOMClassMap>
>;
export type DOMClass = DOMClassPrimitive | DOMClassMap | DOMClassArray;

export function genClassForVnode(vnode: VNode): string {
  let data = vnode.data;
  let parentNode = vnode;
  let childNode = vnode;
  // @TODO merge class from parent vm and child vm, will this process take place
  // when its parent vm or child vm get update at the same time.
  // if so, they are useless calculation
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef((parentNode = parentNode.parent))) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.class);
}

function mergeClassData(
  child: IVNodeData,
  parent: IVNodeData
): {
  class: DOMClass;
} {
  return {
    class: (isDef(child.class)
      ? [child.class, parent.class]
      : parent.class) as DOMClass
  };
}
export function renderClass(dynamicClass: DOMClass): string {
  if (isDef(dynamicClass)) {
    return stringifyClass(dynamicClass);
  }
  return "";
}

export function concat(a?: string, b?: string): string {
  return a ? (b ? a + " " + b : a) : b || "";
}

export function stringifyClass(value: DOMClass): string {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (typeof value === "string") {
    return value;
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  return "";
}

function stringifyArray(value: DOMClassArray): string {
  let res = "";
  let stringified;
  for (let i = 0, l = value.length; i < l; i++) {
    if (isDef((stringified = stringifyClass(value[i]))) && stringified !== "") {
      if (res) res += " ";
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value: DOMClassMap): string {
  let res = "";
  for (const key in value) {
    if (value[key]) {
      if (res) res += " ";
      res += key;
    }
  }
  return res;
}
