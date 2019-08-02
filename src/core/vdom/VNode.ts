import {Component} from "../instance";

interface IFnToInvoke extends Function {
  handler: Function;
}

interface IComponentOptions {
  Ctor: new () => Component;
  propsData?: Object;
  listeners?: Object;
  children?: Array<VNode>;
  tag?: string;
}
interface IDOMListener {
  handler: Function;

  fnToInvoke?: IFnToInvoke;
}
interface IVNodeData {
  key?: string;

  tag?: string;
  class?: string;

  staticClass?: string;
  style?: object;

  staticStyle?: string;

  normalizedStyle?: object;
  attrs?: {[key: string]: any};

  domProps?: object;

  nativeOn?: {[key: string]: Function};

  on?: {[key: string]: IDOMListener};
  props?: object;

  hook?: {[key: string]: Function};
}
class VNode {
  tag?: string;
  data?: IVNodeData;

  children?: Array<VNode>;

  elm?: Element;

  key?: string;

  parent?: VNode;

  text?: string;

  isComment?: boolean;

  context?: Component;
  isCloned?: boolean;

  componentInstance?: Component;
  componentOptions?: IComponentOptions;
  constructor(
    tag?: string,
    data?: IVNodeData,
    children?: Array<VNode>,
    text?: string,
    elm?: Element,
    context?: Component
  ) {
    this.key = this.data && this.data.key;
    this.tag = tag;
    this.data = data;
    this.children = children || [];
    this.text = text;
    this.parent = undefined;
    this.elm = elm;
    this.context = context;
  }

  clone(): VNode {
    const vnode = this;
    const cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context
    );
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.isCloned = true;
    return cloned;
  }
}

function createEmptyVNode(text: string = "") {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
}

function createTextVNode(text: string | number) {
  return new VNode(undefined, undefined, undefined, String(text));
}

type VNodeOn = {[key: string]: IDOMListener};

export {
  IVNodeData,
  IFnToInvoke,
  IDOMListener,
  VNode,
  createEmptyVNode,
  createTextVNode,
  VNodeOn
};
