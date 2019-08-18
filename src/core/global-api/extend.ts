import Vue, {ICtorUserOpt} from "src/core/instance";
import {mergeOptions} from "../util/options";

let cid = 1;

export function ctorExtend(extendOptions: Partial<ICtorUserOpt>): typeof Vue {
  const Super: typeof Vue = this;
  const name = extendOptions.name || Super.options.name;

  // Cache extended function, for `components` option
  // For every pair of `Super` and `extendOptions`, should always return the
  // `Sub`, so that vnodes representing the same components will be treated as
  // same type of vnode
  const cachedSubs = extendOptions._Ctor || (extendOptions._Ctor = {});
  const cachedSub = cachedSubs[Super.cid];

  if (cachedSub) {
    return cachedSub;
  }

  class Sub extends Super {}
  Sub.cid = cid++;

  Sub.super = Super;

  Sub.options = mergeOptions(Super.options, extendOptions);
  if (name) {
    (Sub.options.components || (Sub.options.components = {}))[name] = Sub;
  }

  cachedSubs[Super.cid] = Sub;
  return Sub;
}
