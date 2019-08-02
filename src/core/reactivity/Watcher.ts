import {Dep, popTarget, pushTarget} from "./Dep";
import {Component} from "../instance";
import {remove} from "src/shared/util";
import {isObject} from "util";
import {warn} from "src/shared/debug";
type WatcherCallback = (newValue: any, oldValue: any) => void;

interface IWatcherOptions {
  user?: boolean;
  immediate?: boolean;
  deep?: boolean;

  lazy?: boolean;
}
class Watcher {
  value: any;
  getter: Function;
  target: Component;
  cb: WatcherCallback;
  deps: Array<Dep>;

  dirty?: boolean;
  user?: boolean;
  deep?: boolean;
  lazy?: boolean;

  depIds: Set<number>;
  keyExpOrFn: string | Function;
  constructor(
    target,
    keyExpOrFn: string | Function,
    cb: WatcherCallback,
    options: IWatcherOptions = {},
    isRenderWatcher?: boolean
  ) {
    this.target = target;
    if (isRenderWatcher) {
      target._watcher = this;
      target._watchers.push(this);
    }
    this.deps = [];
    this.depIds = new Set();
    this.getter = parseGetter(keyExpOrFn);
    this.value = this.get();
    this.cb = cb.bind(target);
    this.keyExpOrFn = keyExpOrFn;
    this.lazy = !!options.lazy;
    this.dirty = !!options.lazy;
    this.user = !!options.user;
    this.deep = !!options.deep;
  }

  //
  get() {
    pushTarget(this);
    const val = this.getter(this.target);
    popTarget();
    return val;
  }

  run() {
    const newValue = this.get();
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    if (newValue !== this.value || isObject(newValue) || this.deep) {
      const oldValue = this.value;
      this.value = newValue;
      try {
        this.cb.call(this.target, newValue, oldValue);
      } catch (e) {
        warn(
          `Exception happened in watcher cb, key: ${this.keyExpOrFn}`,
          e,
          this
        );
      }
    }
  }
  update() {
    // judge new and old is equal and execute callback
    // console.log(this.deps);
    // console.log(
    //   `Watcher.update called , before: ${JSON.stringify(
    //     this.value
    //   )}, new ${JSON.stringify(newValue)}`
    // );
    // queue watcher to update async
    if (this.lazy) {
      this.dirty = true;
      return;
    }
    this.run();
  }

  addDep(dep: Dep) {
    if (this.depIds.has(dep.uid)) {
      return;
    }
    this.deps.push(dep);
    this.depIds.add(dep.uid);
    dep.addSubscriber(this);
  }

  teardown() {
    if (!this.target._isBeingDestroyed) {
      remove(this.target._watchers, this);
      this.target._watcher = null;
    }
    this.deps.forEach(dep => {
      dep.removeSubscriber(this);
    });
    this.depIds = null;
  }

  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  depend() {
    this.deps.forEach(dep => dep.depend());
  }
}

function parseGetter(keyPathOrFn) {
  if (typeof keyPathOrFn === "function") {
    return keyPathOrFn;
  }
  return obj => {
    const paths = keyPathOrFn.split(".");
    for (let i = 0; i < paths.length; i++) {
      if (!obj || !obj[paths[i]]) {
        return;
      }

      obj = obj[paths[i]];
    }
    return obj;
  };
}

export {Watcher, IWatcherOptions, WatcherCallback};
