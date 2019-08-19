import Vue from "src";

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
      render(this: Vue, h) {
        return h("div", {class: "test"}, [
          h("p", {}, "this is child content"),
          // this._t("default", [this._v("default content.....123")]),
          this._t("hi")
        ]);
      }
    }
  },
  render(h) {
    return h("test", {}, [
      // h("p", {}, ["this should be slot content"])
      h("p", {slot: "hi"}, ["Hi, guys. I am slot: hi"])
    ]);
  }
}).$mount();
