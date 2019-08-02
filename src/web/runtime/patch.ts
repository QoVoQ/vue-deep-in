import {NodeOps} from "./NodeOps";
import modules from "./modules";
import {createPatchFunction} from "src/core/vdom/patch";

export const patch = createPatchFunction({modules, nodeOps: NodeOps});
