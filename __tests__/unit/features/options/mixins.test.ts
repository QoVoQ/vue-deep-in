import Vue from "src";
import {mergeOptions} from "src/core/util/options";

describe("Options mixins", () => {
  it("vm should have options from mixin", () => {
    const mixin = {
      methods: {
        a: function() {}
      }
    };

    const vm: any = new Vue({
      mixins: [mixin],
      methods: {
        b: function() {}
      }
    });

    expect(vm.a).toBeDefined();
    expect(vm.b).toBeDefined();
  });

  it("should call hooks from mixins first", () => {
    const f1 = function() {};
    const f2 = function() {};
    const f3 = function() {};
    const mixinA = {
      a: 1,
      template: "foo",
      created: f1
    };
    const mixinB = {
      b: 1,
      created: f2
    };
    const result = mergeOptions(
      {},
      {
        template: "bar",
        mixins: [mixinA, mixinB],
        created: f3
      }
    );
    expect(result.a).toBe(1);
    expect(result.b).toBe(1);
    expect(result.created[0]).toBe(f1);
    expect(result.created[1]).toBe(f2);
    expect(result.created[2]).toBe(f3);
    expect(result.template).toBe("bar");
  });

  it("mixin methods should not override defined method", () => {
    const f1 = function() {};
    const f2 = function() {};
    const f3 = function() {};
    const mixinA = {
      methods: {
        xyz: f1
      }
    };
    const mixinB = {
      methods: {
        xyz: f2
      }
    };
    const result = mergeOptions(
      {},
      {
        mixins: [mixinA, mixinB],
        methods: {
          xyz: f3
        }
      }
    );
    expect(result.methods.xyz).toBe(f3);
  });

  it("should accept constructors as mixins", () => {
    const mixin = Vue.extend({
      methods: {
        a: function() {}
      }
    });

    const vm: any = new Vue({
      mixins: [mixin],
      methods: {
        b: function() {}
      }
    });

    expect(vm.a).toBeDefined();
    expect(vm.b).toBeDefined();
  });

  it("should accept further extended constructors as mixins", () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    const mixinA = Vue.extend({
      created: spy1,
      methods: {
        a: function() {}
      }
    });

    const mixinB = mixinA.extend({
      created: spy2
    });

    const vm: any = new Vue({
      mixins: [mixinB],
      methods: {
        b: function() {}
      }
    });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(vm.a).toBeDefined();
    expect(vm.b).toBeDefined();
  });
});
