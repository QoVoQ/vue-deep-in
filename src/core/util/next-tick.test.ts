import {nextTick} from "./next-tick";

describe("nextTick", () => {
  it("accepts a callback", done => {
    nextTick(done);
  });

  it("returns undefined when passed a callback", () => {
    expect(nextTick(() => {})).toBeUndefined();
  });

  if (typeof Promise !== undefined) {
    it("returns a Promise when provided no callback", done => {
      nextTick().then(done);
    });

    it("returns a Promise with a context argument when provided a falsy callback and an object", done => {
      const obj = {};
      nextTick(undefined, obj).then(o => {
        expect(o).toBe(obj);
        done();
      });
    });

    it("returned Promise should resolve correctly vs callback", done => {
      const cb = jest.fn();
      nextTick(cb);
      nextTick().then(() => {
        expect(cb).toHaveBeenCalled();
        done();
      });
    });

    it("callback should be called asynchronously", done => {
      const counter = {num: 1};
      const cb = () => {
        counter.num = 2;
        expect(counter.num).toBe(2);
        done();
      };
      nextTick(cb);
      expect(counter.num).toBe(1);
    });

    it("callbacks should be called before setTimeout", done => {
      const res = [];
      const cb = () => {
        res.push(0);
      };

      setTimeout(() => {
        expect(res.length).toBe(2);
        done();
      }, 0);

      nextTick(cb);
      nextTick().then(cb);
    });
  }
});
