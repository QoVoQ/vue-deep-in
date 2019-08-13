import {Dep, Watcher} from "src/core/reactivity";

describe("Dep", () => {
  let dep: Dep;

  beforeEach(() => {
    dep = new Dep();
  });

  describe("instance", () => {
    it("should be created with correct properties", () => {
      expect(dep.subscribers.length).toBe(0);
      expect(new Dep().uid).toBe(dep.uid + 1);
    });
  });

  describe("addSub()", () => {
    it("should add sub", () => {
      dep.addSubscriber(null);
      expect(dep.subscribers.length).toBe(1);
      expect(dep.subscribers[0]).toBe(null);
    });
  });

  describe("removeSub()", () => {
    it("should remove sub", () => {
      dep.subscribers.push(null);
      dep.removeSubscriber(null);
      expect(dep.subscribers.length).toBe(0);
    });
  });

  describe("depend()", () => {
    let _target;

    beforeAll(() => {
      _target = Dep.target;
    });

    afterAll(() => {
      Dep.target = _target;
    });

    it("should do nothing if no target", () => {
      Dep.target = null;
      dep.depend();
    });

    it("should add itself to target", () => {
      Dep.target = {addDep() {}} as any;
      const spy = jest.spyOn(Dep.target, "addDep");
      dep.depend();
      expect(spy).toHaveBeenCalledWith(dep);
    });
  });

  describe("notify()", () => {
    it("should notify subs", () => {
      const spy = jest.fn();
      const watcher = {
        update() {
          spy();
        }
      } as any;
      dep.subscribers.push(watcher as any);
      dep.notify();
      expect(spy).toHaveBeenCalled();
    });
  });
});
