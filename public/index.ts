import Vue from "src";
import Component from "packages/vue-class-component/src";
import {Watcher} from "src/core/reactivity/Watcher";
function clickHandler(e) {
  console.log(this.b.c);
  console.log(e);
  console.log("clicked.");
}
const vm = new Vue({
  el: "#app",
  render(h) {
    return h(
      "div",
      {
        on: {
          click: [clickHandler]
        }
      },
      [this.b]
    );
  },
  data: {b: {c: 1}}
});
``;
new Watcher(
  vm,
  "$data",
  (newVal, oldVal) => {
    console.log(newVal);
    console.log(newVal === oldVal);
  },
  {deep: true}
);

(vm as any).b.c = 3;
console.log((vm as any).$data);
