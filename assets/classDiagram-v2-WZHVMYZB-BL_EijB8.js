import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-CKFgtrUq.js";
import { _ as __name } from "./index-C4Vth1-2.js";
import "./chunk-FMBD7UC4-BTKEVYmx.js";
import "./chunk-55IACEB6-Drq5cJl4.js";
import "./chunk-QN33PNHL-uDtyL4vL.js";
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
