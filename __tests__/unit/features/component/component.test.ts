import Vue from "src";
import {waitForUpdate} from "src/shared/util";

describe("Component", () => {
  it("static", () => {
    const vm = new Vue({
      render(h) {
        return h("test");
      },
      components: {
        test: {
          data() {
            return {a: 123};
          },
          render(h) {
            return h("span", {}, [this.a]);
          }
        }
      }
    }).$mount();
    expect(vm.$el.tagName).toBe("SPAN");
    expect(vm.$el.innerHTML).toBe("123");
  });

  it("using component in restricted elements", () => {
    const vm = new Vue({
      render(h) {
        return h("div", {}, [h("table", {}, [h("tbody", {}, [h("test")])])]);
      },
      components: {
        test: {
          data() {
            return {a: 123};
          },
          render(h) {
            return h("tr", {}, [h("td", {}, [this.a])]);
          }
        }
      }
    }).$mount();
    expect(vm.$el.innerHTML).toBe(
      "<table><tbody><tr><td>123</td></tr></tbody></table>"
    );
  });

  it("props", () => {
    const vm = new Vue({
      data: {
        list: [{a: 1}, {a: 2}]
      },
      render(h) {
        return h("test", {props: {collection: this.list}}, []);
      },
      components: {
        test: {
          props: {
            collection: {
              type: [Array]
            }
          },
          render(h) {
            return h("ul", {}, this.collection.map(i => h("li", {}, [i.a])));
          }
        }
      }
    }).$mount();

    (vm as any).list[0].a = 3;
    waitForUpdate(() => {
      expect(vm.$el.outerHTML).toBe("<ul><li>3</li><li>2</li></ul>");
    });
  });

  it("properly update replaced higher-order component root node", done => {
    const vm = new Vue({
      data: {
        color: "red"
      },
      components: {
        test: {
          data() {
            return {tag: "div"};
          },
          render(h) {
            return h(this.tag, {class: "test"}, "hi");
          }
        }
      },
      render(h) {
        return h("test", {attrs: {id: "foo"}, class: this.color}, []);
      }
    }).$mount();

    expect(vm.$el.tagName).toBe("DIV");
    expect(vm.$el.id).toBe("foo");
    expect(vm.$el.className).toBe("test red");

    (vm as any).color = "green";
    waitForUpdate(() => {
      expect(vm.$el.tagName).toBe("DIV");
      expect(vm.$el.id).toBe("foo");
      expect(vm.$el.className).toBe("test green");
      (vm.$children[0] as any).tag = "p";
    })
      .then(() => {
        expect(vm.$el.tagName).toBe("P");
        expect(vm.$el.id).toBe("foo");
        expect(vm.$el.className).toBe("test green");
        (vm as any).color = "red";
      })
      .then(() => {
        expect(vm.$el.tagName).toBe("P");
        expect(vm.$el.id).toBe("foo");
        expect(vm.$el.className).toBe("test red");
      })
      .then(done);
  });
});
