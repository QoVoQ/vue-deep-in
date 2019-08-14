import {Dep} from "./Dep";
import {augmentArray} from "./array-augment";
import {def, hasOwn} from "src/shared/util";

interface IObserved {
  __ob__: Observer;
  [key: string]: any;
}
class Observer {
  dep: Dep;
  constructor(public value, depName?: string | number) {
    this.dep = new Dep(`ObserverDep:${depName}`);
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      augmentArray(value);
      observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactivity(obj, key);
    });
  }
}

function defineReactivity(target: object, key: string | number, value?: any) {
  // handle condition 'key' have been defined by `Object.defineProperty`
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  if (descriptor && !descriptor.configurable) {
    return;
  }

  const oldGet = descriptor && descriptor.get;
  const oldSet = descriptor && descriptor.set;
  /**
   *
   */
  if (arguments.length === 2) {
    value = target[key];
  }
  // manage dependency in key's setter and getter
  const dep = new Dep(String(key));
  // manage dependency for set/del operation on `value` obj
  let childOb = observe(value, key);
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      value = oldGet ? oldGet.call(target) : value;
      dep.depend();
      childOb && childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
      return value;
    },

    set(newValue) {
      const oldValue = oldGet ? oldGet.call(target) : value;
      if (Object.is(newValue, oldValue)) {
        return;
      }
      if (oldGet && !oldSet) {
        return;
      }
      if (oldSet) {
        oldSet.call(target, newValue);
      }
      value = newValue;
      childOb = observe(value, key);
      dep.notify();
    }
  });
}

function observe(val, keyName?: string | number): Observer {
  // ignore when input is not an obj || is a vue instance || is a frozen obj
  if (typeof val !== "object" || val._isVue || !Object.isExtensible(val)) {
    return;
  }

  if (val.__ob__) {
    return val.__ob__;
  }

  const ob = new Observer(val, keyName);
  return ob;
}

function observeArray(val) {
  for (let i = 0; i < val.length; i++) {
    observe(val[i], i);
  }
}

function dependArray(arr: Array<any>) {
  arr.forEach(ele => {
    ele && ele.__ob__ && ele.__ob__.dep.depend();
    if (Array.isArray(ele)) {
      dependArray(ele);
    }
  });
}

function set(target: object, key: string | number, val: any): any {
  if (Array.isArray(target) && typeof key === "number") {
    target.splice(Number(key), 1, val);
    return val;
  }

  if (hasOwn(target, key)) {
    target[key] = val;
    return val;
  }
  const ob = observe(target, key);
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactivity(target, key, val);
  ob.dep.notify();
  return val;
}

function del(target: object | IObserved, key: string | number) {
  if (Array.isArray(target) && typeof key === "number") {
    target.splice(Number(key), 1);
    return;
  }

  if (!hasOwn(target, key)) {
    return;
  }
  const ob = (target as IObserved).__ob__;

  delete target[key];
  if (ob) {
    ob.dep.notify();
  }
}

export {IObserved, Observer, observeArray, defineReactivity, observe, set, del};

/**
 * const obj = { name: "Tom" }
 * defineReactivity(obj)
 * const watcherCb = newValue => console.log('new Value changed', newValue)
 * const watcher = Vue.$watch(obj, name, watcherCb)
 */
