import Vue from "src";
import Component from "packages/vue-class-component/src";

type people = {
  age?: number;
  name?: string;
};
@Component({
  el: "#app",
  mounted(this: Child) {
    console.log("mounted.");

    setInterval(() => {
      console.log(child);
    }, 1000);
  },
  // watch: {
  //   nest: {
  //     handler(newVal, oldVal) {
  //       console.log("nested watcher invoked", newVal, oldVal);
  //     },
  //     deep: true
  //   }
  // },
  render(this: Child, c) {
    return c("dev", {}, ["Hello World"]);
  }
})
class Child extends Vue {
  info: people = {
    age: 11
  };
  mewo() {}
  get dd() {
    return "dd";
  }
}
@Component
class GrandChild extends Child {
  info = {
    name: "Tom"
  };
}

const child = new GrandChild();
