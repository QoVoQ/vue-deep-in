import Vue from "src";
import Component from "packages/vue-class-component/src";
import {ComponentLifecycleName} from "src/core/instance/lifecycle";
import {waitForUpdate} from "src/shared/util";

describe("Options data", () => {
  it("should proxy and reactive", done => {
    const data = {msg: "foo"};
    const vm = new Vue({
      data,
      render(h) {
        return h("div", {}, [this.msg]);
      }
    }).$mount();

    expect(vm.$data).toEqual({msg: "foo"});
    expect(vm.$data).toBe(data);
    data.msg = "bar";
    vm.$nextTick()
      .then(() => {
        expect(vm.$el.textContent).toBe("bar");
      })
      .then(done);
  });

  describe("should merge data properly", () => {
    it("merge different key", () => {
      @Component
      class ParentComp extends Vue {
        a = 1;
      }
      @Component
      class ChildComp extends ParentComp {
        b = 2;
      }

      const child = new ChildComp();

      expect(child.a).toBe(1);
      expect(child.b).toBe(2);
    });

    it("merge the same key recursively", () => {
      const WithObject = Vue.extend({
        data() {
          return {
            obj: {a: 1}
          };
        }
      });
      const vm = new WithObject({
        data: {
          obj: {
            b: 2
          }
        },
        render() {
          return null;
        }
      });
      expect((vm as any).obj.a).toBe(1);
      expect((vm as any).obj.b).toBe(2);
    });
  });
  it("should have access to props", () => {
    const Test = {
      props: {
        a: {
          type: [Number]
        }
      },
      render(h) {
        return h("div");
      },
      data() {
        return {
          b: this.a
        };
      }
    };
    const vm = new Vue({
      render(h) {
        return h("Test", {attrs: {a: 1}});
      },
      components: {Test}
    }).$mount();
    expect((vm.$children[0] as any).b).toBe(1);
  });

  it("props should not be reactive", done => {
    let calls = 0;
    const vm = new Vue({
      render(h) {
        return h("child", {attrs: {msg: this.msg}});
      },
      data: {
        msg: "hello"
      },
      beforeUpdate() {
        calls++;
      },
      components: {
        child: {
          render(h) {
            return h("span", {}, this.localMsg);
          },
          props: {
            msg: {
              type: [String]
            }
          },
          data() {
            return {localMsg: this.msg};
          },
          computed: {
            computedMsg() {
              return this.msg + " world";
            }
          }
        }
      }
    }).$mount();
    const child: any = vm.$children[0];
    (vm as any).msg = "hi";
    waitForUpdate(() => {
      expect(child.localMsg).toBe("hello");
      expect(child.computedMsg).toBe("hi world");
      expect(calls).toBe(1);
    }).then(done);
  });
  it("should have access to methods", () => {
    @Component
    class Child extends Vue {
      a: number;
      get() {
        return {a: 1};
      }

      data() {
        return this.get();
      }
    }
    const vm = new Child();
    expect(vm.a).toBe(1);
  });

  it("should be called with this", () => {
    let vm1, vm2;
    @Component
    class Child extends Vue {
      a: number;

      data(this: Vue) {
        vm1 = this;
        return {a: 1};
      }
    }
    vm2 = new Child();
    expect(vm2.a).toBe(1);
    expect(vm1).toBe(vm2);
  });

  it("should be called with vm as first argument when merged", () => {
    const superComponent = {
      data: ({foo}) => ({ext: "ext:" + foo})
    };
    const mixins = [
      {
        data: ({foo}) => ({mixin1: "m1:" + foo})
      },
      {
        data: ({foo}) => ({mixin2: "m2:" + foo})
      }
    ];
    const vm = new Vue({
      beforeCreate() {
        this.foo = 1;
      },
      render(h) {
        return h("div", {}, [h("child")]);
      },
      components: {
        child: {
          extends: superComponent,
          mixins,
          beforeCreate() {
            this.foo = 1;
          },
          render(h) {
            return h("span", {}, [
              `${this.bar}-${this.ext}-${this.mixin1}-${this.mixin2}`
            ]);
          },
          data: ({foo}) => ({bar: "foo:" + foo})
        }
      }
    }).$mount();
    expect(vm.$el.innerHTML).toBe("<span>foo:1-ext:1-m1:1-m2:1</span>");
  });
});
