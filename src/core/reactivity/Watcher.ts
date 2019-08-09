import {Dep, popTarget, pushTarget} from "./Dep";
import {Component} from "../instance";
import {remove, arrayRemove} from "src/shared/util";
import {isObject} from "util";
import {warn} from "src/shared/debug";
import {queueWatcher} from "./scheduler";
import {traverse} from "./traverse";

let uid = 0;
type WatcherCallback = (newValue: any, oldValue: any) => void;

interface IWatcherOptions {
  user?: boolean;
  immediate?: boolean;
  deep?: boolean;

  lazy?: boolean;
}
class Watcher {
  uid: number;
  value: any;
  getter: Function;
  target: Component;
  cb: WatcherCallback;
  // relations between Dep and Watcher is many-to-many
  // keep track of deps that contain current watcher, in order to add/remove dep
  deps: Array<Dep>;
  depIds: Set<number>;
  newDeps: Array<Dep>;
  newDepIds: Set<number>;

  dirty?: boolean;
  user?: boolean;
  deep?: boolean;
  lazy?: boolean;

  keyExpOrFn: string | Function;
  constructor(
    target,
    keyExpOrFn: string | Function,
    cb: WatcherCallback,
    options?: IWatcherOptions,
    isRenderWatcher?: boolean
  ) {
    this.uid = uid++;
    this.target = target;
    if (isRenderWatcher) {
      target._watcher = this;
    }
    target._watchers.push(this);
    if (options) {
      this.lazy = !!options.lazy;
      this.user = !!options.user;
      this.deep = !!options.deep;
    } else {
      this.lazy = this.user = this.deep = false;
    }
    this.dirty = this.lazy;
    this.deps = [];
    this.depIds = new Set();
    this.newDeps = [];
    this.newDepIds = new Set();
    this.getter = parseGetter(keyExpOrFn);
    this.value = this.get();
    this.cb = cb.bind(target);
    this.keyExpOrFn = keyExpOrFn;
  }

  /**
   * have access to observed objects, which will invoke dependency collection
   * through observed objects' `getter`
   */
  get() {
    pushTarget(this);
    const val = this.getter.call(this.target, this.target);
    if (this.deep) {
      traverse(val);
    }
    popTarget();
    this.cleanupDeps();
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
    queueWatcher(this);
  }

  /**
   * Update dependency on every call of Watcher.get
   * @param dep
   */
  addDep(dep: Dep) {
    if (this.newDepIds.has(dep.uid)) {
      return;
    }
    this.newDepIds.add(dep.uid);
    this.newDeps.push(dep);

    if (this.depIds.has(dep.uid)) {
      return;
    }
    this.deps.push(dep);
    this.depIds.add(dep.uid);
    dep.addSubscriber(this);
  }
  /**
   * Remove unrelated dependency after every call of Watcher.get
   */
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      const depId = dep.uid;
      if (!this.newDepIds.has(depId)) {
        dep.removeSubscriber(this);
        this.depIds.delete(depId);
        arrayRemove(this.deps, dep);
      }
    }

    this.newDepIds.clear();
    this.newDeps = [];
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
