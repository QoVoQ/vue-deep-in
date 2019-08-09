import Vue from "src";
import Component from "packages/vue-class-component/src";
@Component({
  el: "#app",
  mounted(this: Child) {
    console.log("mounted.");
    setInterval(() => {}, 1000);
  },
  watch: {
    nest: {
      handler(newVal, oldVal) {
        console.log("nested watcher invoked", newVal, oldVal);
      },
      deep: true
    }
  },
  render(this: Child, c) {
    return c("dev", {}, ["Hello World"]);
  }
})
class Child extends Vue {
  mewo() {}
  get dd() {
    return "dd";
  }
}

new Child();
