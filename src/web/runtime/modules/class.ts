import {isDef} from "src/shared/util";

import {genClassForVnode} from "src/web/util";
import {IVNodeData} from "src/core/vdom/definition";
import {VNodeHookNames} from "./definition";

function updateClass(oldVnode: any, vnode: any) {
  const el = vnode.elm;
  const data: IVNodeData = vnode.data;
  const oldData: IVNodeData = oldVnode.data;
  if (!isDef(data.class) && (!isDef(oldData) || !isDef(oldData.class))) {
    return;
  }

  let cls = genClassForVnode(vnode);

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute("class", cls);
    el._prevClass = cls;
  }
}

export default {
  [VNodeHookNames.create]: updateClass,
  [VNodeHookNames.update]: updateClass
};
