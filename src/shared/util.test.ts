import {def, makeMap} from "./util";

describe("shared/util.def", () => {
  const key = "name";
  const val = "Tom";
  it("should define value on target", () => {
    const target: any = {};
    def(target, key, val);
    expect(target[key]).toBe(val);
  });

  it("defined value should not be enumerable", () => {
    const target: any = {};
    def(target, key, val);
    expect(Object.keys(target).length).toBe(0);
  });
});

describe("shared/util.makeMap", () => {
  const sampleInput = "a,b";
  it("match", () => {
    const fn = makeMap(sampleInput);

    expect(fn("a")).toBe(true);
  });

  it("mismatch", () => {
    const fn = makeMap(sampleInput);
    expect(fn("c")).toBeFalsy();
  });

  it("match && useLowercase: false", () => {
    const fn = makeMap(sampleInput);

    expect(fn("A")).toBeFalsy();
  });

  it("match && useLowercase: true", () => {
    const fn = makeMap(sampleInput, true);

    expect(fn("A")).toBe(true);
  });
});
