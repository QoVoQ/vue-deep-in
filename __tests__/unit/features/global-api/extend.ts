import Vue from "src";
import Component from "packages/vue-class-component/src";

describe("Global API extends", () => {
  it("should correctly merge options", () => {
    const Test = Vue.extend({
      name: "test",
      a: 1,
      b: 2
    });

    expect(Test.options.a).toBe(1);
    expect(Test.options.b).toBe(2);
    expect(Test.super).toBe(Vue);
    expect(Test.options.name).toBe("test");

    const t = new Test({
      a: 2
    });

    expect(t.$options.a).toBe(2);
    expect(t.$options.b).toBe(2);
    // inheritance
    const Test2 = Test.extend({
      a: 2
    });
    expect(Test2.options.a).toBe(2);
    expect(Test2.options.b).toBe(2);

    const t2 = new Test2({a: 3});

    expect(t2.$options.a).toBe(3);
    expect(t2.$options.b).toBe(2);
  });

  it("should warn invalid names", () => {});
  it("should work when used as components", () => {});
  it("should merge lifecycle hooks", () => {
    const calls = [];
    const A = Vue.extend({
      created() {
        calls.push(1);
      }
    });
    const B = A.extend({
      created() {
        calls.push(2);
      }
    });
    new B({
      created() {
        calls.push(3);
      }
    });
    expect(calls).toEqual([1, 2, 3]);
  });

  it("should merge methods", () => {
    const A = Vue.extend({
      methods: {
        a() {
          return this.n;
        }
      }
    });
    const B = A.extend({
      methods: {
        b() {
          return this.n + 1;
        }
      }
    });

    @Component
    class Child extends B {
      n = 0;
      a: () => number;
      b: () => number;
      c() {
        return this.n + 2;
      }
    }

    const b = new Child();
    expect(b.a()).toBe(0);
    expect(b.b()).toBe(1);
    expect(b.c()).toBe(2);
  });
  it("should merge assets", () => {});
  it("extended options should use different identify from parent", () => {
    const A = Vue.extend({computed: {}});
    const B = A.extend({});
    B.options.computed.b = () => "foo";
    expect(B.options.computed).not.toBe(A.options.computed);
    expect(A.options.computed.b).toBeUndefined();
  });
});
