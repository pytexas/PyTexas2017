import Vue from "vue";

import { image, resize, time } from "../filters";
import { get_data, extract_sessions } from "../data";

export var Program = Vue.component("program-page", {
  template: "#tpl-pages-program",
  filters: { image: image, time: time },
  props: ['day'],
  data() {
    return {
      sessions: [],
      title: "Program"
    };
  },
  created() {
    this.init();
  },
  watch: {'$route': 'init'},
  methods: {
    resize: resize,
    init() {
      if (this.day == 18) {
        this.title = 'Saturday 11/18';
      } else {
        this.title = 'Sunday 11/19';
      }
      
      get_data()
        .then(result => {
          this.sessions = extract_sessions(result.data, parseInt(this.day));
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Program;
