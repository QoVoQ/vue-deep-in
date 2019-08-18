import Vue from "src";

describe("Options render", () => {
  it("basic usage", () => {
    const vm = new Vue({
      data: {
        items: [{id: 1, name: "task1"}, {id: 2, name: "task2"}]
      },
      render(h) {
        const children = [];
        this.items.map(item => {
          h("li", {class: "task"}, [item.name]);
        });
        return h("ul", {class: "tasks"}, children);
      }
    }).$mount();

    expect(vm.$el.tagName).toBe("UL");
    for (let i = 0; i < vm.$el.children.length; i++) {
      const element = vm.$el.children[i];
      expect(element.tagName).toBe("LI");
      expect(element.textContent).toBe((vm as any).items[i].name);
    }
  });
});
