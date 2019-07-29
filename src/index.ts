import {interval} from "rxjs";
import {tap} from "rxjs/operators";
import {Observer, Watcher} from "./reactivity";

const stringify = JSON.stringify;
const objFactory = () => ({
  val: (Math.random() * 100) << 0
});

let target: any = {
  t1name: objFactory()
};

let target2: any = {
  t2name: "t2name"
};

let arrayObj = {arr: [1, 2, 3, {name: "Tom"}]};

// make target reactive
new Observer(target);
new Observer(target2);
new Observer(arrayObj);

document.write("Hello World");
const cb = (newVal, oldVal) => {
  console.log("Watcher cb called.");
};
const watcher1 = new Watcher(
  target,
  () => {
    target.t1name.val + target2.t2name;
  },
  cb
);

const arrayBaseWatcher = new Watcher(
  arrayObj,
  () => {
    arrayObj.arr;
  },
  () => {
    console.log("array base change detected.");
  }
);

const arrayObjWatcher = new Watcher(
  arrayObj,
  () => {
    arrayObj.arr[3].name;
  },
  () => {
    console.log("array nested obj detected.");
  }
);
setTimeout(() => {
  target.t1name.val = 434;
}, 1000);

setTimeout(() => {
  target2.t2name = 342342;
  arrayObj.arr.push(55);
}, 2000);
