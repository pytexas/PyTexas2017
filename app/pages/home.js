import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_sponsors } from "../data";

var Home = Vue.component("home-page", {
  template: "#tpl-pages-home",
  filters: { image: image },
  data() {
    return {
      sponsors: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    resize: resize,
    init() {
      get_data()
        .then(result => {
          this.sponsors = extract_sponsors(result.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Home;
