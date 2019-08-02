class NodeOps {
  static createElement(tagName: string): Element {
    return document.createElement(tagName);
  }

  static createTextNode(text: string): Text {
    return document.createTextNode(text);
  }

  static createComment(text: string): Comment {
    return document.createComment(text);
  }

  static insertBefore(parentNode: Node, newNode: Node, referenceNode: Node) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  static removeChild(node: Node, child: Node) {
    node.removeChild(child);
  }

  static appendChild(node: Node, child: Node) {
    node.appendChild(child);
  }

  static parentNode(node: Node): Node {
    return node.parentNode;
  }

  static nextSibling(node: Node): Node {
    return node.nextSibling;
  }

  static tagName(node: Element): string {
    return node.tagName;
  }

  static setTextContent(node: Node, text: string) {
    node.textContent = text;
  }

  static setStyleScope(node: Element, scopeId: string) {
    node.setAttribute(scopeId, "");
  }
}

export {NodeOps};
