import Vue from "src";

describe("Instance methods events", () => {
  let vm: Vue, spy;
  beforeEach(() => {
    vm = new Vue();
    spy = jest.fn();
  });

  it("$on", () => {
    vm.$on("test", function(...args) {
      expect(this).toBe(vm);
      spy(...args);
    });

    vm.$emit("test", 1, 2, 3);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(1, 2, 3);
  });

  it("$on multi event", () => {
    const cb = function(...args) {
      expect(this).toBe(vm);
      spy(...args);
    };
    vm.$on("test1", cb);
    vm.$on("test2", cb);
    vm.$emit("test1", 1, 2, 3, 4);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
    vm.$emit("test2", 5, 6, 7, 8);
    expect(spy).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(5, 6, 7, 8);
  });

  it("$off", () => {
    vm.$on("test", function(...args) {
      expect(this).toBe(vm);
      spy(...args);
    });

    vm.$off("test");
    vm.$emit("test", 1, 2, 3);
    expect(spy).toBeCalledTimes(0);
  });

  it("$off multi event", () => {
    vm.$on("test1", spy);
    vm.$on("test2", spy);
    vm.$on("test3", spy);

    vm.$off("test1", spy);
    vm.$off("test2", spy);

    vm.$emit("test1");
    vm.$emit("test2");

    expect(spy).not.toHaveBeenCalled();
    vm.$emit("test3", 1, 2, 3, 4);
    expect(spy).toBeCalledTimes(1);
  });

  it("$off multi event without callback", () => {
    vm.$on("test1", spy);
    vm.$on("test2", spy);
    vm.$on("test3", spy);

    vm.$off("test1");
    vm.$off("test2");

    vm.$emit("test1");
    vm.$emit("test2");

    expect(spy).not.toHaveBeenCalled();
    vm.$emit("test3", 1, 2, 3, 4);
    expect(spy).toBeCalledTimes(1);
  });

  it("$once", () => {
    vm.$once("test", spy);
    vm.$emit("test", 1, 2, 3);
    vm.$emit("test", 2, 3, 4);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
  });

  it("$off event added by $once", () => {
    vm.$once("test", spy);
    vm.$off("test", spy); // test off event and this event added by once
    vm.$emit("test", 1, 2, 3);
    expect(spy).not.toHaveBeenCalled();
  });

  it("$off partial handler for the same event", () => {
    const spy2 = jest.fn();
    vm.$on("test", spy);
    vm.$on("test", spy2);
    vm.$off("test", spy);
    vm.$emit("test", 1, 2, 3);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toBeCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(1, 2, 3);
  });
});
