import attrs from "./attrs";
import klass from "./class";
import domProps from "./dom-props";
import events from "./event";
import style from "./style";
import {VNode} from "src/core/vdom/VNode";

export enum VNodeHookNames {
  create = "VNODE_HOOK_CREATE",
  update = "VNODE_HOOK_UPDATE",
  remove = "VNODE_HOOK_remove",
  destroy = "VNODE_HOOK_DESTROY"
}

export type VNodeModuleHandler = (oldVnode: VNode, vnode: VNode) => void;
export interface VNodeModule {
  [VNodeHookNames.create]?: VNodeModuleHandler;
  [VNodeHookNames.update]?: VNodeModuleHandler;
  [VNodeHookNames.remove]?: VNodeModuleHandler;
  [VNodeHookNames.destroy]?: VNodeModuleHandler;
}

const modules: Array<VNodeModule> = [attrs, klass, domProps, events, style];

export default modules;
