import {VNode} from "src/core/vdom/VNode";
import {patch} from "src/web/runtime/patch";
import Vue from "src";
import {waitForUpdate} from "src/shared/util";

describe("vdom attrs module", () => {
  it("should create an element with attrs", () => {
    const vnode = new VNode("p", {attrs: {id: 1, class: "class1"}});
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.id).toBe("1");
    expect(elm.classList).toContain("class1");
  });

  it("should change the elements attrs", () => {
    const vnode1 = new VNode("i", {attrs: {id: "1", class: "i am vdom"}});
    const vnode2 = new VNode("i", {attrs: {id: "2", class: "i am"}});
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.id).toBe("2");
    expect(elm.classList).toContain("i");
    expect(elm.classList).toContain("am");
    expect(elm.classList).not.toContain("vdom");
  });

  it("should remove the elements attrs", () => {
    const vnode1 = new VNode("i", {attrs: {id: "1", class: "i am vdom"}});
    const vnode2 = new VNode("i", {attrs: {id: "1"}});
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.id).toBe("1");
    expect(elm.className).toBe("");
  });

  it("should remove the elements attrs for new nodes without attrs data", () => {
    const vnode1 = new VNode("i", {attrs: {id: "1", class: "i am vdom"}});
    const vnode2 = new VNode("i", {});
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2) as HTMLElement;
    expect(elm.id).toBe("");
    expect(elm.className).toBe("");
  });

  it("should remove the falsy value from boolean attr", () => {
    const vnode = new VNode("option", {attrs: {disabled: null}});
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.getAttribute("disabled")).toBe(null);
  });

  it("should set the attr name to boolean attr", () => {
    const vnode = new VNode("option", {attrs: {disabled: true}});
    const elm = patch(null, vnode) as HTMLElement;
    expect(elm.getAttribute("disabled")).toBe("disabled");
  });

  it("should handle mutating observed attrs object", done => {
    const vm = new Vue({
      data: {
        attrs: {
          id: "foo"
        }
      },
      render(h) {
        return h("div", {
          attrs: this.attrs
        });
      }
    }).$mount();

    expect(vm.$el.id).toBe("foo");
    (vm as any).attrs.id = "bar";
    waitForUpdate(() => {
      expect(vm.$el.id).toBe("bar");
      (<any>vm).attrs = {id: "baz"};
    })
      .then(() => {
        expect(vm.$el.id).toBe("baz");
      })
      .then(done);
  });
});
