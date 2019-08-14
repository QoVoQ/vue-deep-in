import {VNode, createTextVNode} from "src/core/vdom/VNode";
import {patch} from "src/web/runtime/patch";

describe("vdom patch: element", () => {
  it("should create an element", () => {
    const vnode = new VNode("p", {attrs: {id: "1"}}, [
      createTextVNode("hello world")
    ]);
    const elm = patch(null, vnode) as Element;
    expect(elm.tagName).toBe("P");
    expect(elm.outerHTML).toBe('<p id="1">hello world</p>');
  });

  it("should create an elements which having text content", () => {
    const vnode = new VNode("div", {}, [createTextVNode("hello world")]);
    const elm = patch(null, vnode) as Element;
    expect(elm.innerHTML).toBe("hello world");
  });

  it("should create create an elements which having span and text content", () => {
    const vnode = new VNode("div", {}, [
      new VNode("span"),
      createTextVNode("hello world")
    ]);
    const elm = patch(null, vnode) as Element;
    expect(elm.children[0].tagName).toBe("SPAN");
    expect(elm.childNodes[1].textContent).toBe("hello world");
  });
});
