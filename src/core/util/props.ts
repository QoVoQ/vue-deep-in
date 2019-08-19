import Vue, {propsOptions} from "src";
import {isObject} from "src/shared/util";
import {warn} from "src/shared/debug";

export function validateProp(
  key: string,
  propsOpt: propsOptions,
  propsData: object,
  vm: Vue
) {
  let value = propsData[key];
  const types = propsOpt[key].type;

  const isValid = types.reduce((acc, cur) => {
    return checkType(cur, value, vm) || acc;
  }, false);

  if (!isValid) {
    warn(`Props validation failed: ${key}`, undefined, vm);
  }

  return value;
}

function checkType(type: Function, val: any, vm: Vue): boolean {
  if (typeof type !== "function") {
    warn("Invalid type to validate", type), vm;
    return false;
  }

  switch (type) {
    case Boolean:
      return typeof val === "boolean" ? true : false;
    case String:
      return typeof val === "string" ? true : false;
    case Number:
      return typeof val === "number" ? true : false;
    case Array:
      return Array.isArray(val);
    case Object:
      return isObject(val);
    default:
      return val instanceof type;
  }
}
