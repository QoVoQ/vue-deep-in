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
  components: {
    MyLabel: {
      props: {
        age: {type: [Number]}
      },
      render(h) {
        return h("div", {}, ["Hello from child component.", this.age]);
      }
    }
  },
  render(h) {
    return h(
      "div",
      {
        style: {
          backgroundColor: "red",
          width: `${this.width}px`
        },
        on: {
          click: [clickHandler]
        }
      },
      [this.b, h("MyLabel", {props: {age: this.width}})]
    );
  },
  data: {b: {c: 1}, width: 100},
  mounted() {
    setInterval(() => {
      this.width += 10;
    }, 1000);
  }
});

(vm as any).b.c = 3;
console.log((vm as any).$data);
