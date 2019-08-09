import {patch} from "./patch";
import {Vue} from "src/core/instance";
import {mountComponent} from "src/core/instance/lifecycle";

export const vueProto__patch__ = patch;
export const vueProto$mount = function(el?: string | Element) {
  el = typeof el === "string" ? document.querySelector(el) : el;
  return mountComponent(this, el);
};

Vue.prototype.__patch__ = vueProto__patch__;
Vue.prototype.$mount = vueProto$mount;

export default Vue;
