import Vue from "src";
import {createEmptyVNode} from "src/core/vdom/VNode";
import {waitForUpdate} from "src/shared/util";

describe("create-element", () => {
  it("render vnode with basic reserved tag using createElement", () => {
    const vm = new Vue({
      data: {msg: "hello world"}
    });
    const h = vm.$createElement;
    const vnode = h("p", {});
    expect(vnode.tag).toBe("p");
    expect(vnode.data).toEqual({});
    expect(vnode.children).toEqual([]);
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.context).toEqual(vm);
  });

  it("render vnode with component using createElement", () => {
    const vm: any = new Vue({
      data: {message: "hello world"},
      components: {
        "my-component": {
          props: {
            msg: {type: [String]}
          }
        }
      }
    });
    const h = vm.$createElement;
    const vnode = h("my-component", {props: {msg: vm.message}});
    expect(vnode.tag).toMatch(/vue-component-[0-9]+/);
    expect(vnode.componentOptions.propsData).toEqual({msg: vm.message});
    expect(vnode.children).toBeUndefined();
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.context).toEqual(vm);
  });

  it("render vnode with custom tag using createElement", () => {
    const vm = new Vue({
      data: {msg: "hello world"}
    });
    const h = vm.$createElement;
    const tag = "custom-tag";
    const vnode = h(tag, {});
    expect(vnode.tag).toBe("custom-tag");
    expect(vnode.data).toEqual({});
    expect(vnode.children).toEqual([]);
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.context).toEqual(vm);
    expect(vnode.componentOptions).toBeUndefined();
  });

  it("render empty vnode with falsy tag using createElement", () => {
    const vm = new Vue({
      data: {msg: "hello world"}
    });
    const h = vm.$createElement;
    const vnode = h(null, {});
    expect(vnode).toEqual(createEmptyVNode());
  });

  it("render vnode with not string tag using createElement", () => {
    const vm: any = new Vue({
      data: {msg: "hello world"}
    });
    const h = vm.$createElement;
    const vnode = h(
      Vue.extend({
        // Component class
        props: {
          msg: {
            type: [String]
          }
        }
      }),
      {props: {msg: vm.message}}
    );
    expect(vnode.tag).toMatch(/vue-component-[0-9]+/);
    expect(vnode.componentOptions.propsData).toEqual({msg: vm.message});
    expect(vnode.children).toBeUndefined();
    expect(vnode.text).toBeUndefined();
    expect(vnode.elm).toBeUndefined();
    expect(vnode.context).toEqual(vm);
  });

  it("render vnode with createElement with children", () => {
    const vm = new Vue({});
    const h = vm.$createElement;
    const vnode = h("p", void 0, [h("br"), "hello world", h("br")]);
    expect(vnode.children[0].tag).toBe("br");
    expect(vnode.children[1].text).toBe("hello world");
    expect(vnode.children[2].tag).toBe("br");
  });

  it("render vnode with children, including boolean and null type", () => {
    const vm = new Vue({});
    const h = vm.$createElement;
    const vnode = h("p", {}, [h("br"), true, 123, h("br"), "abc", null]);
    expect(vnode.children.length).toBe(6);
    expect(vnode.children[0].tag).toBe("br");
    expect(vnode.children[1].text).toBe("true");
    expect(vnode.children[2].text).toBe("123");
    expect(vnode.children[3].tag).toBe("br");
    expect(vnode.children[4].text).toBe("abc");
    expect(vnode.children[5].text).toBe("");
  });

  it("nested child elements should be updated correctly", done => {
    const vm = new Vue({
      data: {n: 1},
      render(h) {
        const list = [];
        for (let i = 0; i < this.n; i++) {
          list.push(h("span", {}, i));
        }
        const input = h("input", {
          attrs: {
            value: "a",
            type: "text"
          }
        });
        return h("div", {}, [...list, input]);
      }
    }).$mount();
    expect(vm.$el.innerHTML).toContain("<span>0</span><input");
    const el = vm.$el.querySelector("input");
    el.value = "b";
    (vm as any).n++;
    waitForUpdate(() => {
      expect(vm.$el.innerHTML).toContain("<span>0</span><span>1</span><input");
      expect(vm.$el.querySelector("input")).toBe(el);
      expect(vm.$el.querySelector("input").value).toBe("b");
    }).then(done);
  });

  // #7786
  it("creates element with vnode reference in :class or :style", () => {
    const vm = new Vue({
      components: {
        foo: {
          render(h) {
            return h(
              "div",
              {
                class: {
                  "has-vnode": this.$vnode
                }
              },
              "foo"
            );
          }
        }
      },
      render: h => h("foo")
    }).$mount();
    expect(vm.$el.innerHTML).toContain("foo");
    expect(vm.$el.classList.contains("has-vnode")).toBe(true);
  });
});
