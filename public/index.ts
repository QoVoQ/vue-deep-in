import Vue from "src";
import Component from "packages/vue-class-component/src";
import {Watcher} from "src/core/reactivity/Watcher";
const vm = new Vue({
  el: "#app",
  data: {
    color: "red"
  },
  components: {
    test: {
      data() {
        return {tag: "div"};
      },
      render(h) {
        return h(this.tag, {class: "test"}, "hi");
      }
    }
  },
  render(h) {
    return h("test", {attrs: {id: "foo"}, class: this.color}, []);
  }
}).$mount();

(vm.$children[0] as any).tag = "p";
