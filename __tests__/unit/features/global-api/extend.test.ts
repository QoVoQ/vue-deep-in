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

  it("should work when used as components", () => {
    const foo = Vue.extend({
      render(h) {
        return h("span", {}, "foo");
      }
    });
    const bar = Vue.extend({
      render(h) {
        return h("span", {}, "bar");
      }
    });
    const vm = new Vue({
      render(h) {
        return h("div", {}, [h("foo"), h("bar")]);
      },
      components: {foo, bar}
    }).$mount();
    expect(vm.$el.innerHTML).toBe("<span>foo</span><span>bar</span>");
  });

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

  it("should not merge nested mixins created with Vue.extend", () => {
    const A = Vue.extend({
      created: () => {}
    });
    const B = Vue.extend({
      mixins: [A],
      created: () => {}
    });
    const C = Vue.extend({
      extends: B,
      created: () => {}
    });
    const D = Vue.extend({
      mixins: [C],
      created: () => {}
    });
    expect(D.options.created.length).toBe(4);
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
  it("should merge assets", () => {
    const A = Vue.extend({
      components: {
        aa: {
          render(h) {
            return h("div", {}, "A");
          }
        }
      }
    });

    const B = A.extend({
      components: {
        bb: {
          render(h) {
            return h("div", {}, "B");
          }
        }
      }
    });

    const b = new B({
      render(h) {
        return h("div", {}, [h("aa"), h("bb")]);
      }
    }).$mount();

    expect(b.$el.innerHTML).toBe("<div>A</div><div>B</div>");
  });

  it("caching", () => {
    const options = {
      render(h) {
        return h("div", {});
      }
    };
    const A = Vue.extend(options);
    const B = Vue.extend(options);
    expect(A).toBe(B);
  });

  it("extended options should use different identify from parent", () => {
    const A = Vue.extend({computed: {}});
    const B = A.extend({});
    B.options.computed.b = () => "foo";
    expect(B.options.computed).not.toBe(A.options.computed);
    expect(A.options.computed.b).toBeUndefined();
  });
});
