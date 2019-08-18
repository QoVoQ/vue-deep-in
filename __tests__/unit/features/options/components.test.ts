import Vue from "src";

describe("Options components", () => {
  it("should accept plain object", () => {
    const vm = new Vue({
      render(h) {
        return h("test");
      },
      components: {
        test: {
          render(h) {
            return h("div", {}, "hi");
          }
        }
      }
    }).$mount();
    expect(vm.$el.tagName).toBe("DIV");
    expect(vm.$el.textContent).toBe("hi");
  });

  it("should accept extended constructor", () => {
    const Test = Vue.extend({
      render(h) {
        return h("div", {}, "hi");
      }
    });
    const vm = new Vue({
      render(h) {
        return h("test");
      },
      components: {
        test: Test
      }
    }).$mount();
    expect(vm.$el.tagName).toBe("DIV");
    expect(vm.$el.textContent).toBe("hi");
  });
});
