import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_sessions } from "../data";

var Program = Vue.component("program-page", {
  template: "#tpl-pages-program",
  filters: { image: image },
  data() {
    return {
      sessions: [],
      title: "Program"
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
          this.sessions = extract_sessions(result.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Program;
