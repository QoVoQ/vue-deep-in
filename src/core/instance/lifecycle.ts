import Vue, {Component} from ".";
import {invokeWithErrorHandler} from "../util/error";
import {VNode} from "../vdom/VNode";
import {remove, noop, isDef, getByPath} from "src/shared/util";
import {Watcher} from "../reactivity/Watcher";
import {pushTarget, popTarget, toggleObserving} from "../reactivity";
import {updateComponentListeners} from "./events";
import {VNodeOn} from "../vdom/definition";
import {validateProp} from "../util/props";
import {resolveSlot} from "./render-helpers/resolve-slot";

export enum ComponentLifecycleName {
  beforeCreate = "beforeCreate",
  created = "created",
  beforeMount = "beforeMount",
  mounted = "mounted",
  beforeUpdate = "beforeUpdate",
  updated = "updated",
  beforeDestroy = "beforeDestroy",
  destroyed = "destroyed"
}

export let activeInstance: any = null;

export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  return () => {
    activeInstance = prevActiveInstance;
  };
}
export const vueProto_update = function(vnode: VNode) {
  const vm: Component = this;
  const prevVnode = vm._vnode;
  const restoreActiveInstance = setActiveInstance(vm);
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode) as Element;
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode) as Element;
  }
  restoreActiveInstance();

  // @TODO don't know why
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};

export const vueProto$forceUpdate = function() {
  const vm: Component = this;
  if (vm._watcher) {
    vm._watcher.update();
  }
};

export const vueProto$destroy = function() {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, ComponentLifecycleName.beforeDestroy);
  vm._isBeingDestroyed = true;
  // remove self from parent
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }

  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, ComponentLifecycleName.destroyed);
  // turn off all instance listeners.
  vm.$off();

  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};

export function initLifecycle(vm: Component) {
  const options = vm.$options;

  const parent = options.parent;
  if (parent) {
    parent.$children.push(vm);
  }
  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];

  vm._watcher = null;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

export function lifecycleMixin(Ctor: typeof Vue) {
  Ctor.prototype._update = vueProto_update;
  Ctor.prototype.$destroy = vueProto$destroy;
  Ctor.prototype.$forceUpdate = vueProto$forceUpdate;
}

export function mountComponent(vm: Component, el?: Element): Component {
  vm.$el = el;

  callHook(vm, ComponentLifecycleName.beforeMount);

  const updateComponent = () => {
    vm._update(vm._render());
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, undefined, true /* isRenderWatcher */);

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, ComponentLifecycleName.mounted);
  }
  return vm;
}

export function updateChildComponent(
  vm: Component,
  propsData: object = {},
  listeners: VNodeOn,
  parentVnode: VNode,
  renderChildren?: Array<VNode>
) {
  const needsForceUpdate = !!(renderChildren || vm.$options._renderChildren); // has new slot // has old slot
  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  // related to slot
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || {};
  vm.$listeners = listeners || {};

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    const props = vm._props;
    const propKeys = vm.$options._propKeys || [];
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i];
      const propOptions = vm.$options.props;
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || {};
  const oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);
  if (needsForceUpdate) {
    vm.$slots = resolveSlot(renderChildren, parentVnode.context);
    vm.$scopedSlots = getByPath(parentVnode, ["data", "scopedSlots"]) || {};
    // @todo why? any necessity?
    vm.$forceUpdate();
  }
}

export function callHook(vm: Component, hookName: ComponentLifecycleName) {
  pushTarget();
  let fns = vm.$options[hookName];
  if (!isDef(fns)) {
    return;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach(fn => {
    invokeWithErrorHandler(fn, vm, undefined, `lifecycle hook: ${hookName}`);
  });
  popTarget();
}
