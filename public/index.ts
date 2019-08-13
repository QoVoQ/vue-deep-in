import Vue from "src";
import Component from "packages/vue-class-component/src";

const vm = new Vue({
  el: "#app",
  render(h) {
    return h("div", {}, [this.msg]);
  },
  data: {msg: "foo"},
  beforeUpdate() {
    this.msg += "!";
  }
});

console.log(111);
(vm as any).msg = "bar";
console.log(222);
setInterval(() => {
  console.log(1222);
}, 1000);
