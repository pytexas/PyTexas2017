import Vue from "vue";

import { image } from "../filters";
import { NAV_LINKS } from "../data";

var LeftNav = Vue.component("left-nav", {
  template: "#tpl-widgets-left-nav",
  filters: { image: image },
  data() {
    return {
      links: NAV_LINKS
    };
  }
});

export default LeftNav;
