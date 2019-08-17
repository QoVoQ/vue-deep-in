import Vue from "../instance";
import {AssetTypes} from "src/shared/constants";

export function initGlobalAPI(Ctor: typeof Vue) {
  Ctor.options = Ctor.options || Object.create(null);
  Ctor.options._base = Ctor;
  Object.keys(AssetTypes).forEach(type => {
    Ctor.options[`${type}s`] = Object.create(null);
  });
}
