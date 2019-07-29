import {Watcher} from "./Watcher";
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
    const idx = this.subscribers.findIndex(watcher);
    if (idx === -1) {
      return;
    }

    this.subscribers.splice(idx, 1);
  }

  depend() {
    if (!Dep.target) {
      return;
    }
    Dep.target.addDep(this);
  }
  notify() {
    console.log(`Dep ${this.name} notify: ${this.uid}`);
    this.subscribers.forEach(sub => sub.update());
  }
}

export {Dep};
