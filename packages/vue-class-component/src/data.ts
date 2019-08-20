import {VueClass} from "./definitions";
import Vue from "src";

export function collectDataFromCtor(vm: Vue, Ctor: VueClass<Vue>) {
  const originalInit = Ctor.prototype._init;
  Ctor.prototype._init = function(this: Vue) {
    const keys = Object.getOwnPropertyNames(vm).filter(
      key => key.charAt(0) !== "_"
    );

    // proxy to actual vm
    // have access to the properties of final vm instance during the
    // initialization process of vm.data
    keys.forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return vm[key];
        },
        set(val) {
          vm[key] = val;
        },
        configurable: true
      });
    });
  };

  const dataSrc = new Ctor();

  Ctor.prototype._init = originalInit;

  const plainData = {};

  Object.entries(dataSrc).forEach(([key, val]) => {
    if (val === undefined) {
      return;
    }
    plainData[key] = val;
  });

  return plainData;
}
