import {Component} from "../instance";
import {VNode} from "./VNode";
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
  key?: string;
  tag?: string;
  class?: string;
  staticClass?: string;
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
