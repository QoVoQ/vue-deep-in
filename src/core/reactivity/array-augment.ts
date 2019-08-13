import {observeArray} from "./Observer";
import {def} from "src/shared/util";
const arrayMethod = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice",
  "reverse",
  "sort"
];
const augmentedArrayPrototype = Object.create(Array.prototype);

arrayMethod.forEach(methodName => {
  const oldMethod = Array.prototype[methodName];
  def(augmentedArrayPrototype, methodName, function(...args) {
    oldMethod.apply(this, args);
    this.__ob__.dep.notify();
    switch (methodName) {
      case "push":
      case "unshift":
        observeArray(args);
      case "splice":
        observeArray(args.slice(2));
      default:
    }
  });
});

function augmentArray(array) {
  Object.setPrototypeOf(array, augmentedArrayPrototype);
}

export {augmentArray};
