import {Dep} from "./Dep";
import {augmentArray} from "./array-augment";
import {def} from "src/shared/util";

class Observer {
  dep: Dep;
  constructor(public value) {
    this.dep = new Dep();
    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      augmentArray(value);
      observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "object") {
        new Observer(value);
      }
      defineReactivity(obj, key, value);
    });
  }
}

function defineReactivity(target, key, value) {
  const dep = new Dep(key);
  let childOb = observe(value);
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend();
      childOb && childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
      return value;
    },

    set(newValue) {
      if (newValue === value) {
        return;
      }
      value = newValue;
      childOb = observe(value);
      dep.notify();
    }
  });
}

function observe(val): Observer {
  if (typeof val !== "object") {
    return;
  }

  if (val.__ob__) {
    return val.__ob__;
  }

  const ob = new Observer(val);
  return ob;
}

function observeArray(val) {
  for (const ele of val) {
    observe(ele);
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
  if (Array.isArray(target)) {
    target.splice(Number(key), 1, val);
    return val;
  }

  if (target.hasOwnProperty(key)) {
    target[key] = val;
    return val;
  }
  const ob = observe(target);
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactivity(target, key, val);
  ob.dep.notify();
  return val;
}

function del(target: object, key: string | number) {
  if (Array.isArray(target)) {
    target.splice(Number(key), 1);
  }

  if (target.hasOwnProperty(key)) {
    return;
  }
  const ob = observe(target);

  delete target[key];

  if (ob) {
    ob.dep.notify();
  }
}

export {Observer, observeArray, defineReactivity, observe, set, del};

/**
 * const obj = { name: "Tom" }
 * defineReactivity(obj)
 * const watcherCb = newValue => console.log('new Value changed', newValue)
 * const watcher = Vue.$watch(obj, name, watcherCb)
 */
