import Component from "packages/vue-class-component/src";
import Vue from "src";

describe("Options methods", () => {
  it("should have correct context", () => {
    @Component
    class Base extends Vue {
      a = 1;
      plus() {
        this.a++;
      }
    }

    const vm = new Base();
    vm.plus();
    expect(vm.a).toBe(2);
  });
});
