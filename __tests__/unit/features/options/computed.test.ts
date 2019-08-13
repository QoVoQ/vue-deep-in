import Component from "packages/vue-class-component/src";
import Vue from "src";

const originalLog = global.console.log;
let mockLog;
beforeEach(() => {
  mockLog = jest.fn();
  global.console.log = mockLog;
});
afterEach(() => {
  global.console.log = originalLog;
});

describe("Options computed", () => {
  it("basic usage", done => {
    @Component({
      render(h) {
        return h("div", {}, [this.b]);
      }
    })
    class Child extends Vue {
      a = 1;
      get b() {
        return this.a + 1;
      }
    }
    const vm = new Child();
    vm.$mount();
    expect(vm.b).toBe(2);
    expect(vm.$el.textContent).toBe("2");
    vm.a = 2;
    expect(vm.b).toBe(3);

    vm.$nextTick()
      .then(() => {
        expect(vm.$el.textContent).toBe("3");
      })
      .then(done);
  });

  it("watching computed", done => {
    const spy = jest.fn();

    @Component
    class Child extends Vue {
      a = 1;
      get b() {
        return this.a + 1;
      }
    }

    const vm = new Child();
    vm.$watch("b", spy);
    vm.a = 2;
    vm.$nextTick()
      .then(() => {
        expect(spy).toBeCalledWith(3, 2);
      })
      .then(done);
  });

  it("lazy computed and caching", () => {
    const spy = jest.fn();

    @Component
    class Child extends Vue {
      a = 1;
      get b() {
        spy();
        return this.a + 1;
      }
    }

    const vm = new Child();
    expect(spy).toBeCalledTimes(0);
    vm.b;
    expect(spy).toBeCalledTimes(1);
    vm.b;
    expect(spy).toBeCalledTimes(1);
  });

  it("as component", done => {
    @Component({
      render(h) {
        return h("div", {}, [this.b + " " + this.c]);
      }
    })
    class Base extends Vue {
      a = 1;
      get b() {
        return this.a + 1;
      }
    }

    class Derived extends Base {
      get c() {
        return this.b + 1;
      }
    }

    const vm = new Derived();
    vm.$mount();

    expect(vm.b).toBe(2);
    expect(vm.c).toBe(3);
    expect(vm.$el.textContent).toBe("2 3");
    vm.a = 2;
    expect(vm.b).toBe(3);
    expect(vm.c).toBe(4);
    vm.$nextTick()
      .then(() => {
        expect(vm.$el.textContent).toBe("3 4");
      })
      .then(done);
  });
});
