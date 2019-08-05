import Vue from "src";

new Vue({
  el: "#app",
  data() {
    return {
      age: 1,
      computed: 0,
      watcher: 0,
      sb: "*",
      arr: [[]]
    };
  },
  mounted() {
    console.log("mounted.");
    setInterval(() => {
      this.age++;
      this.sb += "*";
      this.arr[0].push(0);
    }, 1000);
  },
  computed: {
    hhhh() {
      if (this.arr[0].length % 2 === 0) {
        return "null";
      }
      return this.age + "Name" + this.sb;
    }
  },
  watch: {
    age(newValue, oldValue) {
      console.log("age change detected by watcher:", newValue, oldValue);
    }
  },
  render(c) {
    return c("dev", {}, [
      "Hello World",
      c("a", {class: {red: this.age % 2 === 0}}, ["I am a link"]),
      c("p", {}, [this.age]),
      c("p", {}, [this.hhhh])
    ]);
  }
});
