import {waitForUpdate} from "src/shared/util";
import Vue from "src";

describe("Options propsData", () => {
  it("should work", done => {
    const A = Vue.extend({
      props: {
        a: {
          type: [Number]
        }
      },
      render(h) {
        return h("div", {}, [this.a]);
      }
    });
    const vm = new A({
      propsData: {
        a: 123
      }
    }).$mount();
    expect((vm as any).a).toBe(123);
    expect(vm.$el.textContent).toBe("123");
    (vm as any).a = 234;
    waitForUpdate(() => {
      expect(vm.$el.textContent).toBe("234");
    }).then(done);
  });
});
