import {Dep} from "./Dep";
import {augmentArray} from "./array-augment";
import {def} from "src/util";
import {ObserveOnSubscriber} from "rxjs/internal/operators/observeOn";
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

function observe(val) {
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

export {Observer, observeArray};

/**
 * const obj = { name: "Tom" }
 * defineReactivity(obj)
 * const watcherCb = newValue => console.log('new Value changed', newValue)
 * const watcher = Vue.$watch(obj, name, watcherCb)
 */
