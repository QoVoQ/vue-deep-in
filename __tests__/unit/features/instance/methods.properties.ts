import Vue from "src";
import Component from "packages/vue-class-component/src";

describe("Instance properties", () => {
  it("$data", () => {
    @Component
    class VM extends Vue {
      a = 1;
    }

    const vm = new VM();

    expect(vm.a).toBe(1);
    expect(vm.$data.a).toBe(1);

    vm.a = 2;
    expect(vm.a).toBe(2);
    expect(vm.$data.a).toBe(2);
  });

  it("$options", () => {
    @Component
    class VM extends Vue {
      a() {}
    }

    @Component
    class VMM extends VM {
      b() {}
    }

    const vm = new VMM();

    expect(typeof vm.$options.methods.a).toBe("function");
    expect(typeof vm.$options.methods.b).toBe("function");
  });
});
