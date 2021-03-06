import Component from "packages/vue-class-component/src";
import Vue from "src";
import {waitForUpdate} from "src/shared/util";

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
        render(h) {
          return h("div", {}, []);
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

    it("should mount child parent in correct order", () => {
      const calls = [];
      new Vue({
        render(h) {
          return h("div", {}, [h("test")]);
        },
        mounted() {
          calls.push("parent");
        },
        components: {
          test: {
            render(h) {
              return h("nested");
            },
            mounted() {
              expect(this.$el.parentNode).toBeTruthy();
              calls.push("child");
            },
            components: {
              nested: {
                render(h) {
                  return h("div");
                },
                mounted() {
                  expect(this.$el.parentNode).toBeTruthy();
                  calls.push("nested");
                }
              }
            }
          }
        }
      }).$mount();
      expect(calls).toEqual(["nested", "child", "parent"]);
    });
  });

  describe("beforeUpdate", () => {
    it("should be called before update", done => {
      const vm = new Vue({
        render(h) {
          return h("div", {}, [this.msg]);
        },
        data: {msg: "foo"},
        beforeUpdate() {
          spy();
          expect(this.$el.textContent).toBe("foo");
        }
      }).$mount();
      expect(spy).not.toHaveBeenCalled();
      (vm as any).msg = "bar";
      expect(spy).not.toHaveBeenCalled(); // should be async
      Promise.resolve()
        .then(() => {
          expect(spy).toHaveBeenCalled();
        })
        .then(done);
    });

    it("should be called before render and allow mutating state", done => {
      const vm = new Vue({
        render(h) {
          return h("div", {}, [this.msg]);
        },
        data: {msg: "foo"},
        beforeUpdate() {
          this.msg += "!";
        }
      }).$mount();
      expect(vm.$el.textContent).toBe("foo");
      (vm as any).msg = "bar";
      Promise.resolve()
        .then(() => {
          expect(vm.$el.textContent).toBe("bar!");
        })
        .then(done);
    });

    // #8076
    it("should not be called after destroy", done => {
      const beforeUpdate = jest.fn();
      const destroyed = jest.fn();

      const todo = Vue.extend({
        render(h) {
          return h("div", {}, [this.todo.done]);
        },
        props: {
          todo: {
            type: [Object]
          }
        },
        destroyed,
        beforeUpdate
      });

      const vm = new Vue({
        render(h) {
          return h(
            "div",
            {},
            this.pendingTodos.map(d =>
              h(todo, {
                key: d.id,
                props: {
                  todo: d
                }
              })
            )
          );
        },
        data() {
          return {
            todos: [{id: 1, done: false}]
          };
        },
        computed: {
          pendingTodos() {
            return this.todos.filter(t => !t.done);
          }
        }
      }).$mount();

      (vm as any).todos[0].done = true;
      waitForUpdate(() => {
        expect(destroyed).toHaveBeenCalled();
        expect(beforeUpdate).not.toHaveBeenCalled();
      }).then(done);
    });
  });

  describe("updated", () => {
    it("should be called after update", done => {
      const vm = new Vue({
        render(h) {
          return h("div", {}, [this.msg]);
        },
        data: {msg: "foo"},
        updated() {
          spy();
          expect(this.$el.textContent).toBe("bar");
        }
      }).$mount();
      expect(spy).not.toHaveBeenCalled();
      (vm as any).msg = "bar";
      expect(spy).not.toHaveBeenCalled(); // should be async
      Promise.resolve()
        .then(() => {
          expect(spy).toHaveBeenCalled();
        })
        .then(done);
    });

    // it("should be called after children are updated", done => {
    //   const calls = [];
    //   const vm = new Vue({
    //     template: '<div><test ref="child">{{ msg }}</test></div>',
    //     data: { msg: "foo" },
    //     components: {
    //       test: {
    //         template: `<div><slot></slot></div>`,
    //         updated() {
    //           expect(this.$el.textContent).toBe("bar");
    //           calls.push("child");
    //         }
    //       }
    //     },
    //     updated() {
    //       expect(this.$el.textContent).toBe("bar");
    //       calls.push("parent");
    //     }
    //   }).$mount();

    //   expect(calls).toEqual([]);
    //   vm.msg = "bar";
    //   expect(calls).toEqual([]);
    //   waitForUpdate(() => {
    //     expect(calls).toEqual(["child", "parent"]);
    //   }).then(done);
    // });

    // #8076
    it("should not be called after destroy", done => {
      const updated = jest.fn();
      const destroyed = jest.fn();

      const todo = Vue.extend({
        render(h) {
          return h("div", {}, [this.todo.done]);
        },
        props: {
          todo: {
            type: [Object]
          }
        },
        destroyed,
        updated
      });

      const vm = new Vue({
        render(h) {
          return h(
            "div",
            {},
            this.pendingTodos.map(d =>
              h(todo, {
                key: d.id,
                props: {
                  todo: d
                }
              })
            )
          );
        },
        data() {
          return {
            todos: [{id: 1, done: false}]
          };
        },
        computed: {
          pendingTodos() {
            return this.todos.filter(t => !t.done);
          }
        }
      }).$mount();

      (vm as any).todos[0].done = true;
      waitForUpdate(() => {
        expect(destroyed).toHaveBeenCalled();
        expect(updated).not.toHaveBeenCalled();
      }).then(done);
    });
  });

  describe("beforeDestroy", () => {
    it("should be called before destroy", () => {
      const vm = new Vue({
        render(h) {
          return h("div", {}, []);
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
        render(h) {
          return h("div", {}, []);
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
      render(h) {
        return h("div", {}, []);
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
