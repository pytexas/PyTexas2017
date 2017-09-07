import Vue from "vue";

import { NAV_LINKS } from "../data";

var LeftNav = Vue.component("left-nav", {
  template: "#tpl-widgets-left-nav",
  data() {
    return {
      links: NAV_LINKS
    };
  },
  methods: {
    goto(url) {
      var el = document.querySelector("#app");
      el.scrollTop = 0;
      this.$router.push(url);
    }
  }
});

export default LeftNav;
