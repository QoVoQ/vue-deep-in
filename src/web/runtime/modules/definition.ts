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
