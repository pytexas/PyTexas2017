import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_sponsors } from "../data";

var Sponsors = Vue.component("sponsors-page", {
  template: "#tpl-pages-sponsors",
  filters: { image: image },
  data() {
    return {
      sponsors: [],
      title: "Sponsors"
    };
  },
  created() {
    this.init();
  },
  methods: {
    resize: resize,
    init() {
      get_data()
        .then(data => {
          this.sponsors = extract_sponsors(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Sponsors;
