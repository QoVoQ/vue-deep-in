import {Watcher} from "./Watcher";
import {arrayRemove} from "src/shared/util";
let uid = 0;
class Dep {
  static target: Watcher;
  uid: number;
  name: string | number;
  subscribers: Array<Watcher>;
  constructor(name?: string) {
    this.uid = uid++;
    this.name = name || this.uid;
    this.subscribers = [];
  }

  addSubscriber(watcher: Watcher) {
    this.subscribers.push(watcher);
  }

  removeSubscriber(watcher) {
    arrayRemove(this.subscribers, watcher);
  }

  depend() {
    if (!Dep.target) {
      return;
    }
    Dep.target.addDep(this);
  }
  notify() {
    // console.log(`Dep ${this.name} notify: ${this.uid}`);
    this.subscribers.forEach(sub => sub.update());
  }
}

const targetStack = [];

function pushTarget(target?: Watcher) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

export {Dep, pushTarget, popTarget};
