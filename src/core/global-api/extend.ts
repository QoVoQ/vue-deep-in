import Vue, {ICtorUserOpt} from "src/core/instance";
import {mergeOptions} from "../util/options";

let cid = 1;

export function ctorExtend(extendOptions: Partial<ICtorUserOpt>): typeof Vue {
  const Super: typeof Vue = this;

  class Sub extends Super {}
  Sub.cid = cid++;

  Sub.super = Super;

  Sub.options = mergeOptions(Super.options || {}, extendOptions);
  return Sub;
}
