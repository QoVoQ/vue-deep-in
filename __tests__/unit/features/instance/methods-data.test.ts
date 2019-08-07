import Vue from "src";
import Component from "vue-class-component";

describe("Instance methods data", () => {
  it("$set/$delete", done => {
    @Component
    class VM extends Vue {
      a = {};
      render(h) {
        return h("div", {}, [this.a.msg]);
      }
    }
    const vm = new VM().$mount();

    expect(vm.$el.innerHTML).toBe("");
    vm.$set(vm.a, "msg", "hello");
    vm.$nextTick()
      .then(() => {
        expect(vm.$el.innerHTML).toBe("hello");
        vm.$delete(vm.a, "msg");
      })
      .then(() => {
        expect(vm.$el.innerHTML).toBe("");
      })
      .then(done);
  });
});
