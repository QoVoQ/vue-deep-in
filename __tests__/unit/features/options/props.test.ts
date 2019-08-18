import Vue from "src";
import {waitForUpdate} from "src/shared/util";

describe("Options props", () => {
  it("array syntax", done => {
    const vm: any = new Vue({
      data: {
        b: "bar"
      },
      render(h) {
        return h("test", {props: {b: this.b}});
      },
      components: {
        test: {
          props: {
            b: {
              type: [String]
            }
          },
          render(h) {
            return h("div", {}, this.b);
          }
        }
      }
    }).$mount();
    expect(vm.$el.innerHTML).toBe("bar");
    vm.b = "baz";
    waitForUpdate(() => {
      expect(vm.$el.innerHTML).toBe("baz");
      vm.$children[0].b = "qux";
    })
      .then(() => {
        expect(vm.$el.innerHTML).toBe("qux");
      })
      .then(done);
  });

  // it("non reactive values passed down as prop should not be converted", done => {
  //   const a = Object.freeze({
  //     nested: {
  //       msg: "hello"
  //     }
  //   });
  //   const parent: any = new Vue({
  //     render(h) {
  //       return h("comp", {
  //         props: {
  //           a: this.a.nested
  //         }
  //       });
  //     },
  //     data: {
  //       a: a
  //     },
  //     components: {
  //       comp: {
  //         render(h) {
  //           return h("div");
  //         },
  //         props: {
  //           a: {
  //             type: [String]
  //           }
  //         }
  //       }
  //     }
  //   }).$mount();
  //   const child: any = parent.$children[0];
  //   expect(child.a.msg).toBe("hello");
  //   expect(child.a.__ob__).toBeUndefined(); // should not be converted
  //   parent.a = Object.freeze({
  //     nested: {
  //       msg: "yo"
  //     }
  //   });
  //   waitForUpdate(() => {
  //     expect(child.a.msg).toBe("yo");
  //     expect(child.a.__ob__).toBeUndefined();
  //   }).then(done);
  // });

  // #3453
  // it("should not fire watcher on object/array props when parent re-renders", done => {
  //   const spy = jasmine.createSpy();
  //   const vm = new Vue({
  //     data: {
  //       arr: []
  //     },
  //     template: '<test :prop="arr">hi</test>',
  //     components: {
  //       test: {
  //         props: ["prop"],
  //         watch: {
  //           prop: spy
  //         },
  //         template: "<div><slot></slot></div>"
  //       }
  //     }
  //   }).$mount();
  //   vm.$forceUpdate();
  //   waitForUpdate(() => {
  //     expect(spy).not.toHaveBeenCalled();
  //   }).then(done);
  // });
});
