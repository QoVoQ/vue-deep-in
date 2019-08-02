import {NodeOps} from "./NodeOps";
import {createPatchFunction} from "src/core/vdom/patch";

export const patch = createPatchFunction({nodeOps: NodeOps});
