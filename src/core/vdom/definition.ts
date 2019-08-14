import {Component} from "../instance";
import {VNode} from "./VNode";
import {DOMClass} from "src/web/util/class";
export interface IFnToInvoke extends Function {
  handler: Function;
}
export interface IComponentOptions {
  Ctor: new () => Component;
  propsData?: Object;
  listeners?: Object;
  children?: Array<VNode>;
  tag?: string;
}
export interface IDOMListener {
  handler: Function;
  fnToInvoke?: IFnToInvoke;
}
export interface IVNodeData {
  key?: string | number;
  tag?: string;
  class?: DOMClass;
  style?: object;
  staticStyle?: string;
  normalizedStyle?: object;
  attrs?: {
    [key: string]: any;
  };
  domProps?: object;
  nativeOn?: {
    [key: string]: Function;
  };
  on?: {
    [key: string]: IDOMListener;
  };
  props?: object;
  hook?: {
    [key: string]: Function;
  };
}
