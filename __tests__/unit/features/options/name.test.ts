import Vue from "src";

describe("Options name", () => {
  it("should contain itself in self components", () => {
    const vm = Vue.extend({
      name: "SuperVue"
    });

    expect(vm.options.components["SuperVue"]).toEqual(vm);
  });
});
