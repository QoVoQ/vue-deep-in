import Component from "packages/vue-class-component/src";
import Vue from "src";

describe("Options lifecycle hooks", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();
  });

  describe("beforeCreate", () => {
    it("should allow modifying options", () => {
      @Component
      class Base extends Vue {
        a = 1;
        b: number;
        beforeCreate(this) {
          spy();
          expect(this.a).toBeUndefined();
          this.$options.computed = {
            b() {
              return this.a + 1;
            }
          };
        }
      }
      const vm = new Base();
      expect(spy).toHaveBeenCalled();
      expect(vm.b).toBe(2);
    });
  });

  describe("created", () => {
    it("should have completed observation", () => {
      @Component
      class Base extends Vue {
        a = 1;
        created() {
          expect(this.a).toBe(1);
          spy();
        }
      }
      new Base();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("beforeMount", () => {
    it("should not have mounted", () => {
      @Component({
        render() {
          return null;
        },
        beforeMount() {
          spy();
          expect(this._isMounted).toBe(false);
          expect(this.$el).toBeUndefined();
          expect(this._vnode).toBeNull();
          expect(this._watcher).toBeNull();
        }
      })
      class Base extends Vue {}
      expect(spy).not.toHaveBeenCalled();
      new Base().$mount();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("mounted", () => {
    it("should have mounted", () => {
      @Component({
        render(h) {
          return h("div", {}, []);
        }
      })
      class Base extends Vue {
        mounted() {
          spy();
          expect(this._isMounted).toBe(true);
          expect(this.$el.tagName).toBe("DIV");
          expect(this._vnode.tag).toBe("div");
        }
      }
      const vm = new Base();
      expect(spy).not.toHaveBeenCalled();
      vm.$mount();
      expect(spy).toHaveBeenCalled();
    });

    it("should call for manually mounted instance with parent", () => {
      const parent = new Vue();
      expect(spy).not.toHaveBeenCalled();
      new Vue({
        parent,
        render(h) {
          return h("div", {}, []);
        },
        mounted() {
          spy();
        }
      }).$mount();
      expect(spy).toHaveBeenCalled();
    });
    // it("should mount child parent in correct order", () => {
    //   const calls = [];
    //   new Vue({
    //     template: "<div><test></test></div>",
    //     mounted() {
    //       calls.push("parent");
    //     },P
    //     components: {
    //       test: {
    //         template: "<nested></nested>",
    //         mounted() {
    //           expect(this.$el.parentNode).toBeTruthy();
    //           calls.push("child");
    //         },
    //         components: {
    //           nested: {
    //             template: "<div></div>",
    //             mounted() {
    //               expect(this.$el.parentNode).toBeTruthy();
    //               calls.push("nested");
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }).$mount();
    //   expect(calls).toEqual(["nested", "child", "parent"]);
  });
  describe("beforeDestroy", () => {
    it("should be called before destroy", () => {
      const vm = new Vue({
        render() {
          return null;
        },
        beforeDestroy() {
          spy();
          expect(this._isBeingDestroyed).toBe(false);
          expect(this._isDestroyed).toBe(false);
        }
      }).$mount();
      expect(spy).not.toHaveBeenCalled();
      vm.$destroy();
      vm.$destroy();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe("destroyed", () => {
    it("should be called after destroy", () => {
      const vm = new Vue({
        render() {
          return null;
        },
        destroyed() {
          spy();
          expect(this._isBeingDestroyed).toBe(true);
          expect(this._isDestroyed).toBe(true);
        }
      }).$mount();
      expect(spy).not.toHaveBeenCalled();
      vm.$destroy();
      vm.$destroy();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it("should emit hook events", () => {
    const created = jest.fn();
    const mounted = jest.fn();
    const destroyed = jest.fn();
    const vm = new Vue({
      render() {
        return null;
      },
      created() {
        created();
      },
      mounted() {
        mounted();
      },
      destroyed() {
        destroyed();
      }
    });

    expect(created).toHaveBeenCalled();
    expect(mounted).not.toHaveBeenCalled();
    expect(destroyed).not.toHaveBeenCalled();

    vm.$mount();
    expect(mounted).toHaveBeenCalled();
    expect(destroyed).not.toHaveBeenCalled();

    vm.$destroy();
    expect(destroyed).toHaveBeenCalled();
  });
});
