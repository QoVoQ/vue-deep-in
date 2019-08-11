import Vue from "../instance";

export function initGlobalAPI(Ctor: typeof Vue) {
  Ctor.options = Ctor.options || {};
  Ctor.options._base = Ctor;
}
