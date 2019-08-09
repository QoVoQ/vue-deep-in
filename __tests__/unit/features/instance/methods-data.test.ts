import Vue from "src";
import Component from "packages/vue-class-component/src";

describe("Instance methods data", () => {
  it("$set && $delete", done => {
    type ExtendedVM = VM & {a: {msg?: any}};
    @Component({
      render(this: ExtendedVM, h) {
        return h("div", {}, [this.a.msg]);
      }
    })
    class VM extends Vue {
      a = {};
    }
    const vm: ExtendedVM = new VM();
    vm.$mount();

    expect(vm.$el.innerHTML).toBe("");
    vm.$set(vm.a, "msg", "hello");

    vm.$nextTick()
      .then(() => {
        expect(vm.$el.innerHTML).toBe("hello");
        vm.$delete(vm.a, "msg");
      })
      .then(() => {
        expect(vm.a.msg).toBeUndefined();
        expect(vm.$el.innerHTML).toBe("");
      })
      .then(done);
  });

  describe("$watch", () => {
    let vm: VM, spy;
    @Component
    class VM extends Vue {
      a = {b: 1};

      foo() {}
    }
    beforeEach(() => {
      vm = new VM();
      spy = jest.spyOn(vm, "foo");
    });

    it("basic usage", done => {
      vm.$watch("a.b", vm.foo);
      vm.a.b = 2;

      vm.$nextTick()
        .then(() => {
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(2, 1);
          vm.a = {b: 3};
        })
        .then(() => {
          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toHaveBeenCalledWith(3, 2);
        })
        .then(done);
    });

    it("immediate", () => {
      vm.$watch("a.b", vm.foo, {immediate: true});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(1);
    });

    it("unwatch", done => {
      const unwatch = vm.$watch("a.b", vm.foo);
      unwatch();
      vm.a.b = 2;
      vm.$nextTick()
        .then(() => {
          expect(spy).toHaveBeenCalledTimes(0);
        })
        .then(done);
    });

    it("function watch", done => {
      vm.$watch(function(this: VM) {
        return this.a.b;
      }, vm.foo);
      vm.a.b = 2;

      vm.$nextTick()
        .then(() => {
          expect(spy).toBeCalledTimes(1);
          expect(spy).toBeCalledWith(2, 1);
        })
        .then(done);
    });

    it("deep watch", done => {
      const oldA = vm.a;
      vm.$watch("a", vm.foo, {deep: true});
      vm.a.b = 2;

      setTimeout(() => {
        vm.$nextTick()
          .then(() => {
            expect(spy).toBeCalledTimes(1);
            expect(spy).toBeCalledWith(oldA, oldA);
            vm.a = {b: 3};
          })
          .then(() => {
            expect(spy).toBeCalledTimes(2);
            expect(spy).toBeCalledWith(vm.a, oldA);
          })
          .then(done);
      }, 500);
    });
  });
});
