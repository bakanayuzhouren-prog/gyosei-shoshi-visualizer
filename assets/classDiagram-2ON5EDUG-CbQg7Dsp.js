import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-npijBOsQ.js";
import { _ as __name } from "./index-BNB059v5.js";
import "./chunk-FMBD7UC4-Cegu1Lxh.js";
import "./chunk-55IACEB6-CjJneKmR.js";
import "./chunk-QN33PNHL-gh5ZkC2J.js";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
