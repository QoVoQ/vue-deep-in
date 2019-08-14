import {Component} from "../instance";
import {IVNodeData, IComponentOptions, IDOMListener} from "./definition";
import {toString} from "src/shared/util";

class VNode {
  tag?: string;
  data?: IVNodeData;

  children?: Array<VNode>;

  elm?: Element | Comment | Text;

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
    elm?: Element | Text | Comment,
    context?: Component
  ) {
    this.key = this.data && this.data.key && String(this.data.key);
    this.tag = tag;
    this.data = data;
    this.text = text;
    this.parent = undefined;
    this.elm = elm;
    this.context = context;
    this.children = children;
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

function createTextVNode(text: any): VNode {
  return new VNode(undefined, undefined, undefined, toString(text));
}

type VNodeOn = {[key: string]: IDOMListener};

export {
  IVNodeData,
  IDOMListener,
  VNode,
  createEmptyVNode,
  createTextVNode,
  VNodeOn
};
