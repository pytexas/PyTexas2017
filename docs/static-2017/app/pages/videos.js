import Vue from "vue";

import { get_data, extract_videos } from "../data";

var Videos = Vue.component("video-page", {
  template: "#tpl-pages-videos",
  data() {
    return {
      sessions: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      get_data()
        .then(data => {
          this.sessions = extract_videos(data);
        });
    }
  }
});

export default Videos;
