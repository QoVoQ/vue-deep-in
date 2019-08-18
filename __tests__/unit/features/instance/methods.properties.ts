import Vue from "src";
import Component from "packages/vue-class-component/src";
import {waitForUpdate, triggerEvent} from "src/shared/util";

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

  it("$root/$children", done => {
    const vm = new Vue({
      render(h) {
        return h("div", {}, [this.ok ? h("test") : undefined]);
      },
      data: {ok: true},
      components: {
        test: {
          render(h) {
            return h("div");
          }
        }
      }
    }).$mount();
    expect(vm.$root).toBe(vm);
    expect(vm.$children.length).toBe(1);
    expect(vm.$children[0].$root).toBe(vm);
    (vm as any).ok = false;
    waitForUpdate(() => {
      expect(vm.$children.length).toBe(0);
      (vm as any).ok = true;
    })
      .then(() => {
        expect(vm.$children.length).toBe(1);
        expect(vm.$children[0].$root).toBe(vm);
      })
      .then(done);
  });
  // it("$parent", () => {
  //   const calls = []
  //   const makeOption = name => ({
  //     name,
  //     template: `<div><slot></slot></div>`,
  //     created() {
  //       calls.push(`${name}:${this.$parent.$options.name}`)
  //     }
  //   })
  //   new Vue({
  //     template: `
  //       <div>
  //         <outer><middle><inner></inner></middle></outer>
  //         <next></next>
  //       </div>
  //     `,
  //     components: {
  //       outer: makeOption('outer'),
  //       middle: makeOption('middle'),
  //       inner: makeOption('inner'),
  //       next: makeOption('next')
  //     }
  //   }).$mount()
  //   expect(calls).toEqual(['outer:undefined', 'middle:outer', 'inner:middle', 'next:undefined'])
  // });
  it("$props", done => {
    const Comp = Vue.extend({
      props: {
        msg: {
          type: [String]
        }
      },
      render(h) {
        return h("div", {}, [`${this.msg} ${this.$props.msg}`]);
      }
    });
    const vm = new Comp({
      propsData: {
        msg: "foo"
      }
    }).$mount();
    // check render
    expect(vm.$el.textContent).toContain("foo foo");
    // warn set
    vm.$props = {};
    // expect('$props is readonly').toHaveBeenWarned()
    // check existence
    expect((vm.$props as any).msg).toBe("foo");
    // check change
    (vm as any).msg = "bar";
    expect((vm.$props as any).msg).toBe("bar");
    waitForUpdate(() => {
      expect(vm.$el.textContent).toContain("bar bar");
    })
      .then(() => {
        (vm.$props as any).msg = "baz";
        expect((vm as any).msg).toBe("baz");
      })
      .then(() => {
        expect(vm.$el.textContent).toContain("baz baz");
      })
      .then(done);
  });
  it("warn mutating $props", () => {});

  it("$attr", done => {
    const vm = new Vue({
      render(h) {
        return h("foo", {
          attrs: {
            id: this.foo,
            bar: 1
          }
        });
      },
      data: {foo: "foo"},
      components: {
        foo: {
          props: {
            bar: {
              type: [String]
            }
          },
          render(h) {
            return h("div", {}, [h("div", {attrs: this.$attrs})]);
          }
        }
      }
    }).$mount();
    expect(vm.$el.children[0].id).toBe("foo");
    expect(vm.$el.children[0].hasAttribute("bar")).toBe(false);
    (vm as any).foo = "bar";
    waitForUpdate(() => {
      expect(vm.$el.children[0].id).toBe("bar");
      expect(vm.$el.children[0].hasAttribute("bar")).toBe(false);
    }).then(done);
  });
  // it("$attrs should not be undefined when no props passed in", () => {
  //   const vm = new Vue({
  //     template: `<foo ref="foo" />`,
  //     data: { foo: 'foo' },
  //     components: {
  //       foo: {
  //         template: `<div>foo</div>`
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$refs.foo.$attrs).toBeDefined()
  // });
  it("warn mutating $attrs", () => {});
  it("$listener", done => {
    const spyA = jest.fn();
    const spyB = jest.fn();
    const vm = new Vue({
      render(h) {
        return h("foo", {on: {click: [this.foo]}});
      },
      data: {foo: spyA},
      components: {
        foo: {
          render(h) {
            return h("div", {on: this.$listeners});
          }
        }
      }
    }).$mount();

    // has to be in dom for test to pass in IE
    document.body.appendChild(vm.$el);

    triggerEvent(vm.$el as HTMLElement, "click");
    expect(spyA).toBeCalledTimes(1);
    expect(spyB).toBeCalledTimes(0);

    (vm as any).foo = spyB;
    waitForUpdate(() => {
      triggerEvent(vm.$el as HTMLElement, "click");
      expect(spyA).toBeCalledTimes(1);
      expect(spyB).toBeCalledTimes(1);
      document.body.removeChild(vm.$el);
    }).then(done);
  });
  it("warn mutating $listeners", () => {});
});
