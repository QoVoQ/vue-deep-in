import Component from "packages/vue-class-component/src";
import Vue from "src";

describe("Options el", () => {
  const el = document.createElement("div");
  it("basic usage", () => {
    @Component({
      el,
      render(h) {
        return h("div", {}, [this.message]);
      }
    })
    class Base extends Vue {
      message = "hello world";
    }

    const vm = new Base();

    expect(vm.$el.tagName).toBe("DIV");
    expect(vm.$el.textContent).toBe(vm.message);
  });
});
