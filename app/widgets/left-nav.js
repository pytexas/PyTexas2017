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
  },
  methods: {
    /*
    toggleRightSidenav() {
      this.$refs.rightSidenav.toggle();
    },
    closeRightSidenav() {
      this.$refs.rightSidenav.close();
    },
    open(ref) {
      //console.log("Opened: " + ref);
    },
    close(ref) {
      //console.log("Closed: " + ref);
    },
    */
    goto(url) {
      var el = document.querySelector("#app");
      el.scrollTop = 0;

      this.closeRightSidenav();
      this.$router.push(url);
    }
  }
});

export default LeftNav;
