import {VNode} from "./VNode";
import {isDef, isPrimitive} from "src/shared/util";
import {NodeOps} from "src/web/runtime/NodeOps";
import {VNodeModule, VNodeHookNames} from "src/web/runtime/modules/definition";

export const emptyNode = new VNode("", {}, []);

function sameVNode(a: VNode, b: VNode) {
  return (
    a.key === b.key &&
    (a.tag === b.tag &&
      a.isComment === b.isComment &&
      isDef(a.data) === isDef(b.data) &&
      sameInputType(a, b))
  );
}

function sameInputType(a, b) {
  if (a.tag !== "input") return true;
  let i;
  const typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
  const typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
  return typeA === typeB;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

export function createPatchFunction(backend: {
  modules: VNodeModule[];
  nodeOps: typeof NodeOps;
}) {
  const {modules, nodeOps} = backend;

  const moduleCbs = {};

  Object.values(VNodeHookNames).forEach((hookName: VNodeHookNames) => {
    moduleCbs[hookName] = [];
    modules.forEach((md: VNodeModule) => {
      if (isDef(md[hookName])) {
        moduleCbs[hookName].push(md[hookName]);
      }
    });
  });

  function emptyNodeAt(elm: Element) {
    return new VNode(
      nodeOps.tagName(elm).toLowerCase(),
      {},
      [],
      undefined,
      elm
    );
  }

  function removeNode(el: Node) {
    const parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function insert(parent: Node, elm: Node, ref: Node) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function isPatchable(vnode: VNode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag);
  }

  function addVnodes(
    parentElm: Node,
    refElm: Node,
    vnodes: Array<VNode>,
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: Array<VNode>
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(
        vnodes[startIdx],
        insertedVnodeQueue,
        parentElm,
        refElm,
        vnodes,
        startIdx
      );
    }
  }

  function removeVnodes(
    vnodes: Array<VNode>,
    startIdx: number,
    endIdx: number
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          // invoke destroy hook
          // it seems destroy work was done in the hook
          removeNode(ch.elm);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  /**
   * constructor DOM tree according VNode
   */
  function createElm(
    vnode: VNode,
    insertedVnodeQueue: Array<VNode>,
    parentElm?: Node,
    refElm?: Node,
    ownerArray?: Array<VNode>,
    index?: number
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      // @TODO don't know why
      vnode = ownerArray[index] = vnode.clone();
    }

    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    const children = vnode.children;
    const tag = vnode.tag;
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag);
      createChildren(vnode, children, insertedVnodeQueue);
      // invoke create hook
      if (isDef(vnode.data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
      insert(parentElm, vnode.elm, refElm);
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(String(vnode.text));
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(String(vnode.text));
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(
    vnode: VNode,
    insertedVnodeQueue: VNode[],
    parentElm: Node,
    refElm: Node
  ): boolean {
    const data = vnode.data;
    if (isDef(data)) {
      if (isDef(data.hook) && isDef(data.hook.init)) {
        data.hook.init(vnode);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        return true;
      }
    }
    return false;
  }

  function initComponent(vnode: VNode, insertedVnodeQueue: VNode[]) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(
        insertedVnodeQueue,
        vnode.data.pendingInsert
      );
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
    } else {
      // empty component root.
      insertedVnodeQueue.push(vnode);
    }
  }

  function createChildren(
    vnode: VNode,
    children: VNode[],
    insertedVnodeQueue: VNode[]
  ) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; ++i) {
        createElm(
          children[i],
          insertedVnodeQueue,
          vnode.elm,
          null,
          children,
          i
        );
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(
        vnode.elm,
        nodeOps.createTextNode(String(vnode.text))
      );
    }
  }

  function updateChildren(
    parentElm: Node,
    oldCh: Array<VNode>,
    newCh: Array<VNode>,
    insertedVnodeQueue: Array<VNode>
  ) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (!isDef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (!isDef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVNode(oldStartVnode, newStartVnode)) {
        patchVnode(
          oldStartVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVNode(oldEndVnode, newEndVnode)) {
        patchVnode(
          oldEndVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVNode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(
          oldStartVnode,
          newEndVnode,
          insertedVnodeQueue,
          newCh,
          newEndIdx
        );
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm)
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVNode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(
          oldEndVnode,
          newStartVnode,
          insertedVnodeQueue,
          newCh,
          newStartIdx
        );

        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (!isDef(oldKeyToIdx))
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (!isDef(idxInOld)) {
          // New element
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            newCh,
            newStartIdx
          );
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVNode(vnodeToMove, newStartVnode)) {
            patchVnode(
              vnodeToMove,
              newStartVnode,
              insertedVnodeQueue,
              newCh,
              newStartIdx
            );
            oldCh[idxInOld] = undefined;
            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(
              newStartVnode,
              insertedVnodeQueue,
              parentElm,
              oldStartVnode.elm,
              newCh,
              newStartIdx
            );
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = !isDef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        refElm,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i];
      if (isDef(c) && sameVNode(node, c)) return i;
    }
  }

  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: Array<VNode>,
    ownerArray: Array<VNode>,
    index: number
  ) {
    if (oldVnode === vnode) {
      return;
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = vnode.clone();
    }

    const elm = (vnode.elm = oldVnode.elm);

    const data = vnode.data;
    // invoke hook prepatch
    if (isDef(data) && isDef(data.hook) && isDef(data.hook.prepatch)) {
      data.hook.prepatch(oldVnode, vnode);
    }

    const oldCh = oldVnode.children;
    const ch = vnode.children;

    // invoke hook update
    if (isDef(data) && isPatchable(vnode)) {
      moduleCbs[VNodeHookNames.update].forEach(fn => {
        fn(oldVnode, vnode);
      });
      if (isDef(data.hook) && isDef(data.hook.update)) {
        data.hook.update(oldVnode, vnode);
      }
    }

    if (!isDef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, "");
        }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    // invoke hook postpatch
  }

  const checkNodeType = (node: VNode | Element) => {
    const elm = node as Element;
    return isDef(elm.nodeType);
  };

  return function patch(oldVnode?: VNode | Element, vnode?: VNode) {
    if (!isDef(vnode)) {
      if (isDef(oldVnode)) {
        //invoke hook destroy
        invokeDestroyHook(oldVnode as VNode);
      }
      return;
    }

    let isInitialPatch = false;
    const insertedVnodeQueue = [];

    if (!isDef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      const isRealElement = checkNodeType(oldVnode);
      const mountPoint = oldVnode as Element;
      let preVnode = oldVnode as VNode;
      if (!isRealElement && sameVNode(preVnode, vnode)) {
        // patch existing root node
        patchVnode(preVnode, vnode, insertedVnodeQueue, null, null);
      } else {
        // isRealElement || newVnode & oldVnode is different
        if (isRealElement) {
          // mounting to a real element

          preVnode = emptyNodeAt(mountPoint);
        }

        // replacing existing element
        const oldElm = preVnode.elm;
        const parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // child component's root HTMLElement changed,
        // update parent placeholder node element, recursively
        // Updates that take place here are special, they happens from bottom to top
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent;
          const patchable = isPatchable(vnode);
          while (ancestor) {
            for (let i = 0; i < moduleCbs[VNodeHookNames.destroy].length; ++i) {
              moduleCbs[VNodeHookNames.destroy][i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (
                let i = 0;
                i < moduleCbs[VNodeHookNames.create].length;
                ++i
              ) {
                moduleCbs[VNodeHookNames.create][i](emptyNode, ancestor);
              }

              // e.g. for directives that uses the "inserted" hook.
              const insertHook = ancestor.data.hook.insert;
              insertHook && insertHook(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes([preVnode], 0, 0);
        } else if (isDef(preVnode.tag)) {
          invokeDestroyHook(oldVnode as VNode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };

  function invokeCreateHooks(vnode: VNode, insertedVnodeQueue: Array<VNode>) {
    for (let i = 0; i < moduleCbs[VNodeHookNames.create].length; ++i) {
      moduleCbs[VNodeHookNames.create][i](emptyNode, vnode);
    }
    const vnodeHook = vnode.data.hook;
    if (isDef(vnodeHook)) {
      if (isDef(vnodeHook.create)) vnodeHook.create(emptyNode, vnode);
      if (isDef(vnodeHook.insert)) insertedVnodeQueue.push(vnode);
    }
  }

  function invokeInsertHook(vnode: VNode, queue: VNode[], initial: boolean) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (let i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  function invokeDestroyHook(vnode: VNode) {
    let i, j;
    const data = vnode.data;
    if (isDef(data)) {
      if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode);
      for (i = 0; i < moduleCbs[VNodeHookNames.destroy].length; ++i)
        moduleCbs[VNodeHookNames.destroy][i](vnode);
    }
    if (isDef((i = vnode.children))) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }
}
