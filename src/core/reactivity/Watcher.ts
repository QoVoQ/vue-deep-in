import {Dep} from "./Dep";
type WatcherCallBack = (newValue: any, oldValue: any) => void;

class Watcher {
  value: any;
  getter: Function;
  target: any;
  cb: WatcherCallBack;
  deps: Array<Dep>;

  depIds: Set<number>;
  constructor(target, keyExpOrFn: string | Function, cb: WatcherCallBack) {
    this.target = target;
    this.deps = [];
    this.depIds = new Set();
    this.getter = parseGetter(keyExpOrFn);
    this.value = this.get();
    this.cb = cb.bind(target);
  }

  //
  get() {
    Dep.target = this;
    const val = this.getter(this.target);
    Dep.target = null;
    return val;
  }
  update() {
    const newValue = this.get();

    // judge new and old is equal and execute callback
    console.log(this.deps);
    console.log(
      `Watcher.update called , before: ${JSON.stringify(
        this.value
      )}, new ${JSON.stringify(newValue)}`
    );
    // queue watcher to update async
    this.cb(newValue, this.value);
    this.value = newValue;
  }

  addDep(dep: Dep) {
    if (this.depIds.has(dep.uid)) {
      return;
    }
    this.deps.push(dep);
    this.depIds.add(dep.uid);
    dep.addSubscriber(this);
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

export {Watcher};
