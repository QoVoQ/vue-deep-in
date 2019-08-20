import {Component} from "../instance";
import {VNode} from "./VNode";
import {DOMClass} from "src/web/util/class";

export interface IComponentOptions {
  Ctor: new (...args) => Component;
  propsData?: Object;
  listeners?: VNodeOn;
  children?: Array<VNode>;
  tag?: string;
}
export interface IDOMListener extends Function {
  fnToInvoke?: Function;
}
export type VNodeOn = {[key: string]: IDOMListener[]};
export interface IVNodeData {
  key?: string | number;
  tag?: string;
  class?: DOMClass;
  style?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
  normalizedStyle?: Partial<CSSStyleDeclaration>;
  attrs?: {
    [key: string]: any;
  };
  domProps?: object;
  nativeOn?: VNodeOn;
  on?: VNodeOn;
  // values assigned to components' props
  props?: object;
  hook?: {
    [key: string]: Function;
  };
  pendingInsert?: VNode[];
  slot?: string | number;
}
