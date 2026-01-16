import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-DbLZPYc4.js";
import { _ as __name } from "./index-DS4c09Vg.js";
import "./chunk-FMBD7UC4-C6liYjUA.js";
import "./chunk-55IACEB6-D6cLIFlW.js";
import "./chunk-QN33PNHL-lu2Ic7Jy.js";
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
