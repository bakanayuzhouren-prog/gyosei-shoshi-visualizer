import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-BBwq7JxW.js";
import { _ as __name } from "./index-D3CDJ8Qs.js";
import "./chunk-FMBD7UC4-B3801NCc.js";
import "./chunk-55IACEB6-Dsv5km7x.js";
import "./chunk-QN33PNHL-B-VwZ-ih.js";
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
