import {
  def,
  makeMap,
  isDef,
  isObject,
  isPlainObject,
  isPrimitive,
  camelize,
  arrayRemove
} from "./util";

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

describe("shared/util.camelize", () => {
  it("normal case: hello-world-mate", () => {
    expect(camelize("hello-world-mate")).toBe("helloWorldMate");
  });

  it("not cameliable: hello", () => {
    expect(camelize("hello")).toBe("hello");
  });
});

describe("shared/util.arrayRemove", () => {
  describe("selector is a function", () => {
    it("remove a number", () => {
      const arr = [1, 2, 3];
      const removed = arrayRemove(arr, e => e === 1);
      expect(arr).toEqual([2, 3]);
      expect(removed[0]).toBe(1);
    });

    it("remove an obj", () => {
      const obj = {name: "Tom"};
      const arr = [obj, {age: 10}, null];
      const removed = arrayRemove(arr, e => e === obj);
      expect(arr).toEqual([{age: 10}, null]);
      expect(removed[0]).toBe(obj);
    });
  });
  describe("selector is not a function", () => {
    it("remove a number", () => {
      const arr = [1, 2, 3];
      const removed = arrayRemove(arr, 1);
      expect(arr).toEqual([2, 3]);
      expect(removed[0]).toBe(1);
    });

    it("remove an obj", () => {
      const obj = {name: "Tom"};
      const arr = [obj, {age: 10}, null];
      const removed = arrayRemove(arr, obj);
      expect(arr).toEqual([{age: 10}, null]);
      expect(removed[0]).toBe(obj);
    });
  });
});

describe("shared/util.assertions:", () => {
  function assertionTestCaseFactory(fnToTest: Function) {
    return (param, desc: string, expectRes: boolean) =>
      it(`test on '${desc}' should be ${JSON.stringify(expectRes)}`, () => {
        expect(fnToTest(param)).toBe(expectRes);
      });
  }
  describe("shared/util.isDef", () => {
    const fn = assertionTestCaseFactory(isDef);
    fn(null, "null", false);
    fn(undefined, "undefined", false);
    fn("", "empty string", true);
    fn({}, "object", true);
  });

  describe("shared/util.isObject", () => {
    const fn = assertionTestCaseFactory(isObject);

    fn(null, "null", false);
    fn("", "empty string", false);
    fn(1, "number", false);
    fn({}, "object", true);
  });

  describe("shared/util.isPlainObject", () => {
    const fn = assertionTestCaseFactory(isPlainObject);

    fn(null, "null", false);
    fn("", "empty string", false);
    fn(1, "number", false);
    fn(new Date(), "Date object", false);
    fn({}, "object", true);
  });

  describe("shared/util.isPrimitive", () => {
    const fn = assertionTestCaseFactory(isPrimitive);

    fn(null, "null", false);
    fn(undefined, "undefined", false);
    fn(0, "number 0", true);
    fn("Tom", "string Tom", true);
    fn(true, "boolean true", true);
    fn(Symbol("23"), "symbol", true);
  });
});
