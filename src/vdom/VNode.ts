interface IVNodeData {
  className?: string;
  style?: object;
}
class VNode {
  tag?: string;
  data?: IVNodeData;

  children?: Array<VNode>;

  elm?: HTMLElement;

  parent?: VNode;

  text?: string;

  isComment?: boolean;

  context?: object;
  constructor(
    tag?: string,
    data?: IVNodeData,
    children?: Array<VNode>,
    text?: string
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children || [];
    this.text = text;
    this.parent = undefined;
  }
}

function createEmptyVNode(text: string) {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
}

function createTextVNode(text: string | number) {
  return new VNode(undefined, undefined, undefined, String(text));
}

export {IVNodeData, VNode, createEmptyVNode, createTextVNode};
