import Vue from "src";
import Component from "packages/vue-class-component/src";
@Component({
  el: "#app",
  mounted(this: Child) {
    console.log("mounted.");
    setInterval(() => {
      // this.age++;
      // this.sb += "*";
      // this.arr[0].push(0);
      this.nest = {a: 1};
    }, 1000);
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
    return c("dev", {}, [
      "Hello World",
      c("a", {class: {red: this.age % 2 === 0}}, ["I am a link"]),
      c("p", {}, [this.age]),
      c("p", {}, [this.hhhh])
    ]);
  }
})
class Child extends Vue {
  age = 1;
  computed = 0;
  watcher = 0;
  sb = "*";
  arr = [[]];
  nest = {
    a: 1
  };

  get hhhh() {
    if (this.arr[0].length % 2 === 0) {
      return "null";
    }
    return this.age + "Name" + this.sb;
  }

  get ddd() {
    return "ddd";
  }
}

new Child();
