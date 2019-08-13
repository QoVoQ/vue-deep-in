import Vue from "src";

describe("Options watch", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();
  });

  it("basic usage", done => {
    const vm = new Vue({
      data: {
        a: 1
      },
      watch: {
        a: spy
      }
    });
    expect(spy).not.toHaveBeenCalled();
    (vm as any).a = 2;
    expect(spy).not.toHaveBeenCalled();
    vm.$nextTick()
      .then(() => {
        expect(spy).toHaveBeenCalledWith(2, 1);
      })
      .then(done);
  });

  it("string method name", done => {
    const vm = new Vue({
      data: {
        a: 1
      },
      watch: {
        a: "onChange"
      },
      methods: {
        onChange: spy
      }
    });
    expect(spy).not.toHaveBeenCalled();
    (vm as any).a = 2;
    expect(spy).not.toHaveBeenCalled();
    vm.$nextTick()
      .then(() => {
        expect(spy).toHaveBeenCalledWith(2, 1);
      })
      .then(done);
  });

  it("multiple cbs (after option merge)", done => {
    const spy1 = jest.fn();
    const Test = Vue.extend({
      watch: {
        a: spy1
      }
    });
    const vm = new Test({
      data: {a: 1},
      watch: {
        a: spy
      }
    });
    (vm as any).a = 2;
    vm.$nextTick()
      .then(() => {
        expect(spy1).toHaveBeenCalledWith(2, 1);
        expect(spy).toHaveBeenCalledWith(2, 1);
      })
      .then(done);
  });

  it("with option: immediate", done => {
    const vm = new Vue({
      data: {a: 1},
      watch: {
        a: {
          handler: spy,
          immediate: true
        }
      }
    });
    expect(spy).toHaveBeenCalledWith(1);
    (vm as any).a = 2;
    vm.$nextTick()
      .then(() => {
        expect(spy).toHaveBeenCalledWith(2, 1);
      })
      .then(done);
  });

  it("with option: deep", done => {
    const vm = new Vue({
      data: {a: {b: 1}},
      watch: {
        a: {
          handler: spy,
          deep: true
        }
      }
    });
    const oldA = (vm as any).a;
    expect(spy).not.toHaveBeenCalled();
    (vm as any).a.b = 2;
    expect(spy).not.toHaveBeenCalled();
    vm.$nextTick()
      .then(() => {
        expect(spy).toHaveBeenCalledWith((vm as any).a, (vm as any).a);
        (vm as any).a = {b: 3};
      })
      .then(() => {
        expect(spy).toHaveBeenCalledWith((vm as any).a, oldA);
      })
      .then(done);
  });

  it("correctly merges multiple extends", done => {
    const spy2 = jest.fn();
    const spy3 = jest.fn();
    const A = Vue.extend({
      data: function() {
        return {
          a: 0,
          b: 0
        };
      },
      watch: {
        b: spy
      }
    });

    const B = A.extend({
      watch: {
        a: spy2
      }
    });

    const C = B.extend({
      watch: {
        a: spy3
      }
    });

    const vm = new C();
    (vm as any).a = 1;

    vm.$nextTick()
      .then(() => {
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledWith(1, 0);
        expect(spy3).toHaveBeenCalledWith(1, 0);
      })
      .then(done);
  });

  it("should support watching unicode paths", done => {
    const vm = new Vue({
      data: {
        数据: 1
      },
      watch: {
        数据: spy
      }
    });
    expect(spy).not.toHaveBeenCalled();
    vm["数据"] = 2;
    expect(spy).not.toHaveBeenCalled();
    vm.$nextTick()
      .then(() => {
        expect(spy).toHaveBeenCalledWith(2, 1);
      })
      .then(done);
  });
});
