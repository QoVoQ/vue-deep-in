import Vue from "src";
import {VNode, IVNodeData, createEmptyVNode} from "./VNode";
import {
  activeInstance,
  callHook,
  ComponentLifecycleName,
  updateChildComponent
} from "../instance/lifecycle";
import {ICtorUserOpt, IInternalComponentOptions} from "../instance";
import {isObject} from "src/shared/util";
import {warn} from "src/shared/debug";
import {extractPropsDataFromVNodeData} from "./helpers/extract-props";

const componentVNodeHooks = {
  init(vnode: VNode) {
    const child = (vnode.componentInstance = createComponentInstanceForVNode(
      vnode,
      activeInstance
    ));
    child.$mount();
  },
  prepatch(oldVnode: VNode, vnode: VNode) {
    const options = vnode.componentOptions;
    const child = (vnode.componentInstance = oldVnode.componentInstance);
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert(vnode: VNode) {
    const {componentInstance} = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, ComponentLifecycleName.mounted);
    }
  },
  destroy(vnode: VNode) {
    const {componentInstance} = vnode;
    if (!componentInstance._isDestroyed) {
      componentInstance.$destroy();
    }
  }
};

function installComponentHooks(data: IVNodeData) {
  data.hook = data.hook || {};
  Object.entries(componentVNodeHooks).forEach(([name, fn]) => {
    data.hook[name] = fn;
  });
}

function createComponentInstanceForVNode(vnode: VNode, parent: Vue): Vue {
  const option: IInternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  };

  return new vnode.componentOptions.Ctor(option);
}
export function createComponent(
  Ctor: Partial<ICtorUserOpt> | typeof Vue,
  context: Vue,
  tag: string,
  data: IVNodeData = {},
  children?: Array<any> | any
): VNode {
  if (isObject(Ctor)) {
    Ctor = context.$options._base.extend(Ctor);
  }
  if (typeof Ctor !== "function") {
    warn(`Invalid Component definition: ${Ctor}`);
    return createEmptyVNode();
  }

  installComponentHooks(data);

  const propsData = extractPropsDataFromVNodeData(Ctor, data);
  // vm instance listeners
  const listeners = data.on;
  data.on = data.nativeOn;

  const ctorName = Ctor.options.name;
  const tagName = `vue-component-${Ctor.cid}${ctorName || ""}`;
  return new VNode(tagName, data, undefined, undefined, undefined, context, {
    Ctor,
    children,
    listeners,
    propsData,
    tag
  });
}
