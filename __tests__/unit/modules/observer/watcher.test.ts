import Vue from "src";
import {Watcher} from "src/core/reactivity/Watcher";
import {waitForUpdate} from "src/shared/util";

describe("Watcher", () => {
  let vm, spy;
  beforeEach(() => {
    vm = new Vue({
      render(h) {
        return h("div", {}, []);
      },
      data: {
        a: 1,
        b: {
          c: 2,
          d: 4
        },
        c: "c",
        msg: "yo"
      }
    }).$mount();
    spy = jest.fn();
  });

  it("path", done => {
    const watcher = new Watcher(vm, "b.c", spy);
    expect(watcher.value).toBe(2);
    vm.b.c = 3;
    waitForUpdate(() => {
      expect(watcher.value).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, 2);
      vm.b = {c: 4}; // swapping the object
    })
      .then(() => {
        expect(watcher.value).toBe(4);
        expect(spy).toHaveBeenCalledWith(4, 3);
      })
      .then(done);
  });

  it("non-existent path, set later", done => {
    const watcher1 = new Watcher(vm, "b.e", spy);
    expect(watcher1.value).toBeUndefined();
    // check $add should not affect isolated children
    const child2 = new Vue({parent: vm});
    const watcher2 = new Watcher(child2, "b.e", spy);
    expect(watcher2.value).toBeUndefined();
    vm.$set(vm.b, "e", 123);
    waitForUpdate(() => {
      expect(watcher1.value).toBe(123);
      expect(watcher2.value).toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(123, undefined);
    }).then(done);
  });

  it("delete", done => {
    const watcher = new Watcher(vm, "b.c", spy);
    expect(watcher.value).toBe(2);
    vm.$delete(vm.b, "c");
    waitForUpdate(() => {
      expect(watcher.value).toBeUndefined();
      expect(spy).toHaveBeenCalledWith(undefined, 2);
    }).then(done);
  });

  it("path containing $data", done => {
    const watcher = new Watcher(vm, "$data.b.c", spy);
    expect(watcher.value).toBe(2);
    vm.b = {c: 3};
    waitForUpdate(() => {
      expect(watcher.value).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, 2);
      vm.$data.b.c = 4;
    })
      .then(() => {
        expect(watcher.value).toBe(4);
        expect(spy).toHaveBeenCalledWith(4, 3);
      })
      .then(done);
  });

  it("deep watch", done => {
    let oldB;
    const w = new Watcher(vm, "b", spy, {
      deep: true
    });
    vm.b.c = {d: 4};
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      oldB = vm.b;
      vm.b = {c: [{a: 1}]};
    })
      .then(() => {
        expect(spy).toHaveBeenCalledWith(vm.b, oldB);
        expect(spy).toHaveBeenCalledTimes(2);
        vm.b.c[0].a = 2;
      })
      .then(() => {
        expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
        expect(spy).toHaveBeenCalledTimes(3);
      })
      .then(done);
  });

  it("deep watch data", done => {
    new Watcher(vm, "$data", spy, {
      deep: true
    });
    vm.b.c = 3;
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(vm.$data, vm.$data);
      done();
    }, 100);
  });

  it("deep watch with circular references", done => {
    new Watcher(vm, "b", spy, {
      deep: true
    });
    vm.$set(vm.b, "_", vm.b);
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy).toHaveBeenCalledTimes(1);
      vm.b._.c = 1;
    })
      .then(() => {
        expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
        expect(spy).toHaveBeenCalledTimes(2);
      })
      .then(done);
  });

  it("fire change for prop addition/deletion in non-deep mode", done => {
    new Watcher(vm, "b", spy);
    vm.$set(vm.b, "e", 123);
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy).toHaveBeenCalledTimes(1);
      vm.$delete(vm.b, "e");
    })
      .then(() => {
        expect(spy).toHaveBeenCalledTimes(2);
      })
      .then(done);
  });

  it("watch function", done => {
    const watcher = new Watcher(
      vm,
      function() {
        return this.a + this.b.d;
      },
      spy
    );
    expect(watcher.value).toBe(5);
    vm.a = 2;
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(6, 5);
      vm.b = {d: 2};
    })
      .then(() => {
        expect(spy).toHaveBeenCalledWith(4, 6);
      })
      .then(done);
  });

  it("lazy mode", done => {
    const watcher = new Watcher(
      vm,
      function() {
        return this.a + this.b.d;
      },
      null,
      {lazy: true}
    );
    expect(watcher.lazy).toBe(true);
    expect(watcher.value).toBeUndefined();
    expect(watcher.dirty).toBe(true);
    watcher.evaluate();
    expect(watcher.value).toBe(5);
    expect(watcher.dirty).toBe(false);
    vm.a = 2;
    waitForUpdate(() => {
      expect(watcher.value).toBe(5);
      expect(watcher.dirty).toBe(true);
      watcher.evaluate();
      expect(watcher.value).toBe(6);
      expect(watcher.dirty).toBe(false);
    }).then(done);
  });

  it("teardown", done => {
    const watcher = new Watcher(vm, "b.c", spy);
    watcher.teardown();
    vm.b.c = 3;
    waitForUpdate(() => {
      expect(watcher.active).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    }).then(done);
  });
});
