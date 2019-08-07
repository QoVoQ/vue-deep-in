import Component from "../src";
import Vue from "src";

describe("test component", () => {
  it("base", () => {
    @Component
    class Child extends Vue {
      msg = "Hello World";
      people = {age: 11, name: "Tom"};

      say() {
        this.msg = "hello";
      }
    }

    const vm = new Child();

    expect(vm.msg).toBe("Hello World");
    expect(vm.people).toEqual({age: 11, name: "Tom"});
    vm.say();
    expect(vm.msg).toBe("hello");
  });
});
