import {observe, Observer, Dep} from "src/core/reactivity";
import {set as setProp, del as delProp} from "src/core/reactivity";
import Vue from "src";

describe("Observer", () => {
  it("create on non-observables", () => {
    // skip primitive value
    const ob1 = observe(1);
    expect(ob1).toBeUndefined();
    // avoid vue instance
    const ob2 = observe(new Vue());
    expect(ob2).toBeUndefined();
    // avoid frozen objects
    const ob3 = observe(Object.freeze({}));
    expect(ob3).toBeUndefined();
  });

  it("create on object", () => {
    // on object
    const obj: any = {
      a: {},
      b: {}
    };
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);
    // should've walked children
    expect(obj.a.__ob__ instanceof Observer).toBe(true);
    expect(obj.b.__ob__ instanceof Observer).toBe(true);
    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);
  });

  it("create on null", () => {
    // on null
    const obj = Object.create(null);
    obj.a = {};
    obj.b = {};
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);
    // should've walked children
    expect(obj.a.__ob__ instanceof Observer).toBe(true);
    expect(obj.b.__ob__ instanceof Observer).toBe(true);
    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);
  });

  it("create on already observed object", () => {
    // on object
    const obj: any = {};
    let val = 0;
    let getCount = 0;
    Object.defineProperty(obj, "a", {
      configurable: true,
      enumerable: true,
      get() {
        getCount++;
        return val;
      },
      set(v) {
        val = v;
      }
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    getCount = 0;
    // Each read of 'a' should result in only one get underlying get call
    obj.a;
    expect(getCount).toBe(1);
    obj.a;
    expect(getCount).toBe(2);

    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    // should call underlying setter
    obj.a = 10;
    expect(val).toBe(10);
  });

  it("create on property with only getter", () => {
    // on object
    const obj: any = {};
    Object.defineProperty(obj, "a", {
      configurable: true,
      enumerable: true,
      get() {
        return 123;
      }
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    // should be able to read
    expect(obj.a).toBe(123);

    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    // since there is no setter, you shouldn't be able to write to it
    // PhantomJS throws when a property with no setter is set
    // but other real browsers don't
    try {
      obj.a = 101;
    } catch (e) {}
    expect(obj.a).toBe(123);
  });

  it("create on property with only setter", () => {
    // on object
    const obj: any = {};
    let val = 10;
    Object.defineProperty(obj, "a", {
      configurable: true,
      enumerable: true,
      set(v) {
        val = v;
      }
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    // reads should return undefined
    expect(obj.a).toBe(undefined);

    // should return existing ob on already observed objects
    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    // writes should call the set function
    obj.a = 100;
    expect(val).toBe(100);
  });

  it("create on property which is marked not configurable", () => {
    // on object
    const obj: any = {};
    Object.defineProperty(obj, "a", {
      configurable: false,
      enumerable: true,
      value: 10
    });

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);
  });

  it("create on array", () => {
    // on object
    const arr: any[] = [{}, {}];
    const ob1 = observe(arr);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(arr);
    expect((arr as any).__ob__).toBe(ob1);
    // should've walked children
    expect(arr[0].__ob__ instanceof Observer).toBe(true);
    expect(arr[1].__ob__ instanceof Observer).toBe(true);
  });

  it("observing object prop change", () => {
    const obj = {a: {b: 2}, c: NaN};
    observe(obj);
    // mock a watcher!
    const watcher = {
      deps: [],
      addDep(dep: Dep) {
        this.deps.push(dep);
        dep.addSubscriber(this);
      },
      update: jest.fn()
    };
    // collect dep
    Dep.target = watcher as any;
    obj.a.b;
    Dep.target = null;
    expect(watcher.deps.length).toBe(3); // obj.a + a + a.b
    obj.a.b = 3;
    expect(watcher.update).toHaveBeenCalledTimes(1);
    // swap object
    obj.a = {b: 4};
    expect(watcher.update).toHaveBeenCalledTimes(2);
    watcher.deps = [];

    Dep.target = watcher as any;
    obj.a.b;
    obj.c;
    Dep.target = null;
    expect(watcher.deps.length).toBe(4);
    // set on the swapped object
    obj.a.b = 5;
    expect(watcher.update).toHaveBeenCalledTimes(3);
    // should not trigger on NaN -> NaN set
    obj.c = NaN;
    expect(watcher.update).toHaveBeenCalledTimes(3);
  });

  it("observing object prop change on defined property", () => {
    const obj: any = {val: 2};
    Object.defineProperty(obj, "a", {
      configurable: true,
      enumerable: true,
      get() {
        return this.val;
      },
      set(v) {
        this.val = v;
        return this.val;
      }
    });

    observe(obj);
    expect(obj.a).toBe(2); // Make sure 'this' is preserved
    obj.a = 3;
    expect(obj.val).toBe(3); // make sure 'setter' was called
    obj.val = 5;
    expect(obj.a).toBe(5); // make sure 'getter' was called
  });

  it("observing set/delete", () => {
    const obj1: any = {a: 1};
    const ob1 = observe(obj1);
    const dep1 = ob1.dep;
    spyOn(dep1, "notify");
    setProp(obj1, "b", 2);
    expect(obj1.b).toBe(2);
    expect(dep1.notify).toHaveBeenCalledTimes(1);
    delProp(obj1, "a");
    expect(obj1.a).toBeUndefined();
    expect(dep1.notify).toHaveBeenCalledTimes(2);
    // set existing key, should be a plain set and not
    // trigger own ob's notify
    setProp(obj1, "b", 3);
    expect(obj1.b).toBe(3);
    expect(dep1.notify).toHaveBeenCalledTimes(2);
    // set non-existing key
    setProp(obj1, "c", 1);
    expect(obj1.c).toBe(1);
    expect(dep1.notify).toHaveBeenCalledTimes(3);
    // should ignore deleting non-existing key
    delProp(obj1, "a");
    expect(dep1.notify).toHaveBeenCalledTimes(3);
    // should work on non-observed objects
    const obj2 = {a: 1};
    delProp(obj2, "a");
    expect(obj2.a).toBeUndefined();
    // should work on Object.create(null)
    const obj3 = Object.create(null);
    obj3.a = 1;
    const ob3 = observe(obj3);
    const dep3 = ob3.dep;
    spyOn(dep3, "notify");
    setProp(obj3, "b", 2);
    expect(obj3.b).toBe(2);
    expect(dep3.notify).toHaveBeenCalledTimes(1);
    delProp(obj3, "a");
    expect(obj3.a).toBeUndefined();
    expect(dep3.notify).toHaveBeenCalledTimes(2);
    // set and delete non-numeric key on array
    const arr2: any = ["a"];
    const ob2 = observe(arr2);
    const dep2 = ob2.dep;
    spyOn(dep2, "notify");
    setProp(arr2, "b", 2);
    expect(arr2.b).toBe(2);
    expect(dep2.notify).toHaveBeenCalledTimes(1);
    delProp(arr2, "b");
    expect(arr2.b).toBeUndefined();
    expect(dep2.notify).toHaveBeenCalledTimes(2);
  });

  it("observing array mutation", () => {
    const arr = [];
    const ob = observe(arr);
    const dep = ob.dep;
    spyOn(dep, "notify");
    const objs = [{}, {}, {}];
    arr.push(objs[0]);
    arr.pop();
    arr.unshift(objs[1]);
    arr.shift();
    arr.splice(0, 0, objs[2]);
    arr.sort();
    arr.reverse();
    expect(dep.notify).toHaveBeenCalledTimes(7);
    // inserted elements should be observed
    objs.forEach((o: any) => {
      expect(o.__ob__ instanceof Observer).toBe(true);
    });
  });

  it("should lazy invoke existing getters", () => {
    const obj: any = {};
    let called = false;
    Object.defineProperty(obj, "getterProp", {
      enumerable: true,
      get: () => {
        called = true;
        return "some value";
      }
    });
    observe(obj);
    expect(called).toBe(false);
  });
});
