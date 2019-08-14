import {VNode} from "src/core/vdom/VNode";
import {patch} from "src/web/runtime/patch";

describe("vdom class module", () => {
  it("should create an element with class", () => {
    const vnode = new VNode("p", {class: "class1"});
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.classList).toContain("class1");
  });

  it("should create an element with array class", () => {
    const vnode = new VNode("p", {class: ["class1", "class2"]});
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.classList).toContain("class1");
    expect(elm.classList).toContain("class2");
  });

  it("should create an element with object class", () => {
    const vnode = new VNode("p", {
      class: {class1: true, class2: false, class3: true}
    });
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.classList).toContain("class1");
    expect(elm.classList).not.toContain("class2");
    expect(elm.classList).toContain("class3");
  });

  it("should create an element with mixed class", () => {
    const vnode = new VNode("p", {
      class: [
        {class1: false, class2: true, class3: false},
        "class4",
        ["class5", "class6"]
      ]
    });
    const vnode1 = new VNode("p", {
      class: "new-class1 new-class2"
    });
    let elm = patch(null, vnode) as HTMLElement;
    expect(elm.classList).not.toContain("class1");
    expect(elm.classList).toContain("class2");
    expect(elm.classList).not.toContain("class3");
    expect(elm.classList).toContain("class4");
    expect(elm.classList).toContain("class5");
    expect(elm.classList).toContain("class6");

    elm = patch(vnode, vnode1) as HTMLElement;
    expect(elm.classList).toContain("new-class1");
    expect(elm.classList).toContain("new-class2");
    expect(elm.classList).not.toContain("class2");
    expect(elm.classList).not.toContain("class4");
    expect(elm.classList).not.toContain("class5");
    expect(elm.classList).not.toContain("class6");
  });

  it("should change the elements class", () => {
    const vnode1 = new VNode("p", {
      class: {class1: true, class2: false, class3: true}
    });
    const vnode2 = new VNode("p", {class: "foo bar"});
    let elm = patch(null, vnode1);
    elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.classList).not.toContain("class1");
    expect(elm.classList).not.toContain("class2");
    expect(elm.classList).not.toContain("class3");
    expect(elm.classList).toContain("foo");
    expect(elm.classList).toContain("bar");
  });

  it("should remove the elements class", () => {
    const vnode1 = new VNode("p", {
      class: {class1: true, class2: false, class3: true}
    });
    const vnode2 = new VNode("p", {class: {}});
    let elm = patch(null, vnode1);
    elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.classList).not.toContain("class1");
    expect(elm.classList).not.toContain("class2");
    expect(elm.classList).not.toContain("class3");
  });

  it("should remove class for new nodes without class data", () => {
    const vnode1 = new VNode("p", {
      class: {class1: true, class2: false, class3: true}
    });
    const vnode2 = new VNode("p", {});
    let elm = patch(null, vnode1);
    elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.classList).not.toContain("class1");
    expect(elm.classList).not.toContain("class2");
    expect(elm.classList).not.toContain("class3");
  });
});
