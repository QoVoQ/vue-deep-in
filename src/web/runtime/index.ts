import {patch} from "./patch";
import {Vue} from "src/core/instance";
import {mountComponent} from "src/core/instance/lifecycle";

Vue.prototype.__patch__ = patch;
Vue.prototype.$mount = function(el: string | Element) {
  el = typeof el === "string" ? document.querySelector(el) : el;
  return mountComponent(this, el);
};

export default Vue;
