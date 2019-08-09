import Vue from "src";
import Component from "packages/vue-class-component/src";
import {Dep} from "src/core/reactivity";

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
        mounted() {
          const _msg = this.greet;
          expect(Dep.target).toBeUndefined();
        }
      })
      class VVM extends VM {
        get greet() {
          return this.msg;
        }
      }

      new VVM().$mount();
    });
  });
});
