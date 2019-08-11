import {VueClass} from "./definitions";
import Vue, {ICtorUserOpt} from "src";
import {componentFactory} from "./component";

function Component<T extends VueClass>(Ctor: T): T;
function Component(
  option: Partial<ICtorUserOpt>
): <T extends VueClass>(Ctor: T) => T;
function Component<T extends VueClass>(
  optionOrCtor: Partial<ICtorUserOpt> | T
) {
  if (typeof optionOrCtor === "function") {
    return componentFactory(optionOrCtor, {});
  } else {
    return (Ctor: VueClass) => componentFactory(Ctor, optionOrCtor);
  }
}

export default Component;
