import {Component} from "../instance";
import {VNode} from "./VNode";
import {DOMClass} from "src/web/util/class";

export interface IComponentOptions {
  Ctor: new () => Component;
  propsData?: Object;
  listeners?: Object;
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
  nativeOn?: {
    [key: string]: Function;
  };
  on?: VNodeOn;
  props?: object;
  hook?: {
    [key: string]: Function;
  };
}
