import Vue from "src";
import Component from "packages/vue-class-component/src";
import {Dep} from "src/core/reactivity";
import {waitForUpdate} from "src/shared/util";

describe("Instance methods lifecycle", () => {
  describe("$mount", () => {
    @Component({
      render(h) {
        return h("div", {}, [this.msg]);
      }
    })
    class VM extends Vue {
      msg = "hi";
    }

    it("empty mount", () => {
      const vm = new VM().$mount();
      expect(vm.$el.tagName).toBe("DIV");
      expect(vm.$el.textContent).toBe("hi");
    });

    it("mount to existing element", () => {
      const el = document.createElement("div");

      const vm = new VM().$mount(el);
      expect(vm.$el.tagName).toBe("DIV");
      expect(vm.$el.textContent).toBe("hi");
    });

    it("mount to id", () => {
      const el = document.createElement("div");
      el.id = "mount-test";
      const vm = new VM().$mount("#mount-test");
      expect(vm.$el.tagName).toBe("DIV");
      expect(vm.$el.textContent).toBe("hi");
    });

    it("Dep.target should be undefined in lifecycle", () => {
      // @TODO should test `mounted` in child component
      @Component({
        components: {
          myComp: {
            render(h) {
              return h("div", {}, "hi");
            },
            mounted() {
              const _msg = this.msg;
              expect(Dep.target).toBe(undefined);
            },
            computed: {
              msg() {
                return 1;
              }
            }
          }
        },
        render(h) {
          return h("div", {}, [h("myComp")]);
        }
      })
      class VVM extends VM {}

      new VVM().$mount();
    });

    describe("$destroy", () => {
      it("remove self from parent", () => {
        const vm = new Vue({
          render(h) {
            return h("test");
          },
          components: {
            test: {
              render(h) {
                return h("div");
              }
            }
          }
        }).$mount();
        vm.$children[0].$destroy();
        expect(vm.$children.length).toBe(0);
      });

      it("teardown watchers", () => {
        const vm = new Vue({
          data: {a: 123},
          render(h) {
            return h("div");
          }
        }).$mount();
        vm.$watch("a", () => {});
        vm.$destroy();
        expect(vm._watcher.active).toBe(false);
        expect(vm._watchers.every(w => !w.active)).toBe(true);
      });

      it("avoid duplicate calls", () => {
        const spy = jest.fn();
        const vm = new Vue({
          beforeDestroy: spy
        });
        vm.$destroy();
        vm.$destroy();
        expect(spy).toBeCalledTimes(1);
      });
    });
  });

  describe("$forceUpdate", () => {
    it("should force update", done => {
      const vm = new Vue({
        data: {
          a: {}
        },
        render(h) {
          return h("div", {}, this.a.b);
        }
      }).$mount();
      expect(vm.$el.textContent).toBe("");
      (vm as any).a.b = "foo";
      waitForUpdate(() => {
        // should not work because adding new property
        expect(vm.$el.textContent).toBe("");
        vm.$forceUpdate();
      })
        .then(() => {
          expect(vm.$el.textContent).toBe("foo");
        })
        .then(done);
    });
  });

  describe("$nextTick", () => {
    it("should be called after DOM update in correct context", done => {
      const vm = new Vue({
        render(h) {
          return h("div", {}, this.msg);
        },
        data: {
          msg: "foo"
        }
      }).$mount();
      (vm as any).msg = "bar";
      vm.$nextTick(function() {
        expect(this).toBe(vm);
        expect(vm.$el.textContent).toBe("bar");
        done();
      });
    });

    if (typeof Promise !== "undefined") {
      it("should be called after DOM update in correct context, when using Promise syntax", done => {
        const vm = new Vue({
          render(h) {
            return h("div", {}, this.msg);
          },
          data: {
            msg: "foo"
          }
        }).$mount();
        (vm as any).msg = "bar";
        vm.$nextTick().then(ctx => {
          expect(ctx).toBe(vm);
          expect(vm.$el.textContent).toBe("bar");
          done();
        });
      });
    }
  });
});
