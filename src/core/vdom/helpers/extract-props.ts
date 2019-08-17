import {IVNodeData} from "../VNode";
import Vue from "src";
import {isDef, hasOwn} from "src/shared/util";
/**
 * Handle assignment of props for component.
 *
 * <son :age="111" />
 * This is what will happen as for the template above:
 *
 * ====>
 * // data: INodeData
 * {
 *  attrs: { age: 111 }
 * }
 * ====>
 * // data: INodeData
 * {
 *  attrs: {}
 * }
 *
 * propsData: {age: 111}
 */
export function extractPropsDataFromVNodeData(
  Ctor: typeof Vue,
  data: IVNodeData
) {
  const propsOpt = Ctor.options.props;
  if (!isDef(propsOpt)) {
    return;
  }
  const {props, attrs} = data;
  const res = {};

  if (!isDef(props) && !isDef(attrs)) {
    return res;
  }

  for (const key in propsOpt) {
    checkProps(res, props, key, true) || checkProps(res, attrs, key, false);
  }

  return res;
}

function checkProps(res: object, src: object, key: string, preserve: boolean) {
  if (src && hasOwn(src, key)) {
    res[key] = src[key];
    !preserve && delete src[key];
    return true;
  }
  return false;
}
