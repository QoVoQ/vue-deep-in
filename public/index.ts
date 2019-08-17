import Vue from "src";
import Component from "packages/vue-class-component/src";
import {Watcher} from "src/core/reactivity/Watcher";
function clickHandler(e) {
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
      data() {
        return {
          timer: null
        };
      },
      render(h) {
        return h("div", {}, ["Hello from mylabel component.", this.age]);
      },
      mounted() {
        this.timer = setInterval(() => {
          this.$emit("click", {msg: "custom click event"});
        }, 1000);
      },
      beforeDestroy() {
        console.log("timer cleaned");
        clearInterval(this.timer);
      }
    },
    YourLabel: {
      props: {
        age: {type: [Number]}
      },
      render(h) {
        return h("div", {}, ["Hello from yourlabel component.", this.age]);
      }
    }
  },
  render(h) {
    const child =
      this.width % 2 === 0
        ? h("MyLabel", {on: {click: [clickHandler]}, props: {age: this.width}})
        : h("YourLabel", {props: {age: this.width}});
    return h(
      "div",
      {
        style: {
          backgroundColor: "red",
          width: `${this.width}px`
        }
      },
      [this.b, child]
    );
  },
  data: {b: {c: 1}, width: 100},
  mounted() {
    setInterval(() => {
      this.width += 11;
    }, 3000);
  }
});

(vm as any).b.c = 3;
console.log((vm as any).$data);
