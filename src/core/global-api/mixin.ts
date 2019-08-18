import Vue, {ICtorUserOpt} from "../instance";
import {mergeOptions} from "../util/options";

export function ctorMixin(this: typeof Vue, mix: Partial<ICtorUserOpt>) {
  this.options = mergeOptions(this.options, mix);
  return this;
}
