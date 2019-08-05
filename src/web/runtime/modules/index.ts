import attrs from "./attrs";
import klass from "./class";
import domProps from "./dom-props";
import events from "./event";
import style from "./style";
import {VNodeModule} from "./definition";

const modules: Array<VNodeModule> = [attrs, klass, domProps, events, style];

export default modules;
