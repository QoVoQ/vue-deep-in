import Vue, {ICtorUserOpt} from "src/core/instance";
import {mergeOptions} from "../util/options";

let cid = 1;

export function ctorExtend(extendOptions: Partial<ICtorUserOpt>): typeof Vue {
  const Super: typeof Vue = this;
  const name = extendOptions.name || Super.options.name;
  class Sub extends Super {}
  Sub.cid = cid++;

  Sub.super = Super;

  Sub.options = mergeOptions(Super.options || {}, extendOptions);
  if (name) {
    (Sub.options.components || (Sub.options.components = {}))[name] = Sub;
  }
  return Sub;
}
