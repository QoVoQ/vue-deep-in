import Vue from "src";
import {queueWatcher as _queueWatcher} from "src/core/reactivity/scheduler";

function queueWatcher(watcher) {
  watcher.vm = {}; // mock vm
  _queueWatcher(watcher);
}

function waitForUpdate(cb) {
  return Promise.resolve().then(cb);
}

describe("Scheduler", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();
  });

  it("queueWatcher", done => {
    queueWatcher({
      run: spy
    });
    Promise.resolve()
      .then(() => {
        expect(spy).toReturnTimes(1);
      })
      .then(done);
  });

  it("dedup", done => {
    queueWatcher({
      uid: 1,
      run: spy
    });
    queueWatcher({
      uid: 1,
      run: spy
    });
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }).then(done);
  });

  it("allow duplicate when flushing", done => {
    const job = {
      uid: 1,
      run: spy
    };
    queueWatcher(job);
    queueWatcher({
      uid: 2,
      run() {
        queueWatcher(job);
      }
    });
    waitForUpdate(() => {
      expect(spy).toBeCalledTimes(2);
    }).then(done);
  });

  // it("call user watchers before component re-render", done => {
  //   const calls = [];
  //   const vm = new Vue({
  //     data: {
  //       a: 1
  //     },
  //     template: "<div>{{ a }}</div>",
  //     watch: {
  //       a() {
  //         calls.push(1);
  //       }
  //     },
  //     beforeUpdate() {
  //       calls.push(2);
  //     }
  //   }).$mount();
  //   vm.a = 2;
  //   waitForUpdate(() => {
  //     expect(calls).toEqual([1, 2]);
  //   }).then(done);
  // });

  // it("call user watcher triggered by component re-render immediately", done => {
  //   // this happens when a component re-render updates the props of a child
  //   const calls = [];
  //   const vm = new Vue({
  //     data: {
  //       a: 1
  //     },
  //     watch: {
  //       a() {
  //         calls.push(1);
  //       }
  //     },
  //     beforeUpdate() {
  //       calls.push(2);
  //     },
  //     template: '<div><test :a="a"></test></div>',
  //     components: {
  //       test: {
  //         props: ["a"],
  //         template: "<div>{{ a }}</div>",
  //         watch: {
  //           a() {
  //             calls.push(3);
  //           }
  //         },
  //         beforeUpdate() {
  //           calls.push(4);
  //         }
  //       }
  //     }
  //   }).$mount();
  //   vm.a = 2;
  //   waitForUpdate(() => {
  //     expect(calls).toEqual([1, 2, 3, 4]);
  //   }).then(done);
  // });

  it("should call newly pushed watcher after current watcher is done", done => {
    const callOrder = [];
    queueWatcher({
      uid: 1,
      user: true,
      run() {
        callOrder.push(1);
        queueWatcher({
          uid: 2,
          run() {
            callOrder.push(3);
          }
        });
        callOrder.push(2);
      }
    });
    waitForUpdate(() => {
      expect(callOrder).toEqual([1, 2, 3]);
    }).then(done);
  });

  // GitHub issue #5191
  // it("emit should work when updated hook called", done => {
  //   const el = document.createElement("div");
  //   const vm = new Vue({
  //     template: `<div><child @change="bar" :foo="foo"></child></div>`,
  //     data: {
  //       foo: 0
  //     },
  //     methods: {
  //       bar: spy
  //     },
  //     components: {
  //       child: {
  //         template: `<div>{{foo}}</div>`,
  //         props: ["foo"],
  //         updated() {
  //           this.$emit("change");
  //         }
  //       }
  //     }
  //   }).$mount(el);
  //   vm.$nextTick(() => {
  //     vm.foo = 1;
  //     vm.$nextTick(() => {
  //       expect(vm.$el.innerHTML).toBe("<div>1</div>");
  //       expect(spy).toHaveBeenCalled();
  //       done();
  //     });
  //   });
  // });
});
