import Vue from "src";
import Component from "packages/vue-class-component/src";
import {ComponentLifecycleName} from "src/core/instance/lifecycle";

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
      type ab = {a?: any; b?: any};

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
  // it('should have access to props', () => {
  //   const Test = {
  //     props: ['a'],
  //     render() { },
  //     data() {
  //       return {
  //         b: this.a
  //       }
  //     }
  //   }
  //   const vm = new Vue({
  //     template: `<test ref="test" :a="1"></test>`,
  //     components: { Test }
  //   }).$mount()
  //   expect(vm.$refs.test.b).toBe(1)
  // })

  // it('props should not be reactive', done => {
  //   let calls = 0
  //   const vm = new Vue({
  //     template: `<child :msg="msg"></child>`,
  //     data: {
  //       msg: 'hello'
  //     },
  //     beforeUpdate() { calls++ },
  //     components: {
  //       child: {
  //         template: `<span>{{ localMsg }}</span>`,
  //         props: ['msg'],
  //         data() {
  //           return { localMsg: this.msg }
  //         },
  //         computed: {
  //           computedMsg() {
  //             return this.msg + ' world'
  //           }
  //         }
  //       }
  //     }
  //   }).$mount()
  //   const child = vm.$children[0]
  //   vm.msg = 'hi'
  //   waitForUpdate(() => {
  //     expect(child.localMsg).toBe('hello')
  //     expect(child.computedMsg).toBe('hi world')
  //     expect(calls).toBe(1)
  //   }).then(done)
  // })
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
});
