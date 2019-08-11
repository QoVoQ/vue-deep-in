import Vue from "src";
import Component from "packages/vue-class-component/src";

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
});
