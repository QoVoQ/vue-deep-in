import {VNode} from "src/core/vdom/VNode";
import {patch} from "src/web/runtime/patch";
import {triggerEvent} from "src/shared/util";

describe("vdom events module", () => {
  it("should attach event handler to element", () => {
    const click = jest.fn();
    const vnode = new VNode("a", {on: {click: [click]}});

    const elm = patch(null, vnode) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("should not duplicate the same listener", () => {
    const click = jest.fn();
    const vnode1 = new VNode("a", {on: {click: [click]}});
    const vnode2 = new VNode("a", {on: {click: [click]}});

    const elm = patch(null, vnode1) as HTMLElement;
    patch(vnode1, vnode2);
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("should update different listener", () => {
    const click = jest.fn();
    const click2 = jest.fn();
    const vnode1 = new VNode("a", {on: {click: [click]}});
    const vnode2 = new VNode("a", {on: {click: [click2]}});

    const elm = patch(null, vnode1) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
    expect(click2).toHaveBeenCalledTimes(0);

    patch(vnode1, vnode2);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
    expect(click2).toHaveBeenCalledTimes(1);
  });

  it("should attach Array of multiple handlers", () => {
    const click0 = jest.fn();
    const click1 = jest.fn();
    const vnode = new VNode("a", {on: {click: [click0, click1]}});

    const elm = patch(null, vnode) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click0).toHaveBeenCalledTimes(1);
    expect(click1).toHaveBeenCalledTimes(1);
  });

  it("should update Array of multiple handlers", () => {
    const click = jest.fn();
    const click2 = jest.fn();
    const vnode1 = new VNode("a", {on: {click: [click, click2]}});
    const vnode2 = new VNode("a", {on: {click: [click]}});

    const elm = patch(null, vnode1) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
    expect(click2).toHaveBeenCalledTimes(1);

    patch(vnode1, vnode2);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(2);
    expect(click2).toHaveBeenCalledTimes(1);
  });

  it("should remove handlers that are no longer present", () => {
    const click = jest.fn();
    const vnode1 = new VNode("a", {on: {click: [click]}});
    const vnode2 = new VNode("a", {});

    const elm = patch(null, vnode1) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);

    patch(vnode1, vnode2);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("should remove Array handlers that are no longer present", () => {
    const click0 = jest.fn();
    const click1 = jest.fn();
    const vnode1 = new VNode("a", {on: {click: [click0, click1]}});
    const vnode2 = new VNode("a", {});

    const elm = patch(null, vnode1) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click0).toHaveBeenCalledTimes(1);
    expect(click1).toHaveBeenCalledTimes(1);

    patch(vnode1, vnode2);
    triggerEvent(elm, "click");
    expect(click0).toHaveBeenCalledTimes(1);
    expect(click1).toHaveBeenCalledTimes(1);
  });

  // #4650
  it("should handle single -> array or array -> single handler changes", () => {
    const click = jest.fn();
    const click2 = jest.fn();
    const click3 = jest.fn();
    const vnode0 = new VNode("a", {on: {click: [click]}});
    const vnode1 = new VNode("a", {on: {click: [click, click2]}});
    const vnode2 = new VNode("a", {on: {click: [click]}});
    const vnode3 = new VNode("a", {on: {click: [click2, click3]}});

    const elm = patch(null, vnode0) as HTMLElement;
    document.body.appendChild(elm);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(1);
    expect(click2).toHaveBeenCalledTimes(0);

    patch(vnode0, vnode1);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(2);
    expect(click2).toHaveBeenCalledTimes(1);

    patch(vnode1, vnode2);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(3);
    expect(click2).toHaveBeenCalledTimes(1);

    patch(vnode2, vnode3);
    triggerEvent(elm, "click");
    expect(click).toHaveBeenCalledTimes(3);
    expect(click2).toHaveBeenCalledTimes(2);
    expect(click3).toHaveBeenCalledTimes(1);
  });
});
