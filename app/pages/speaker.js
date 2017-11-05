import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_speaker } from "../data";

var Speaker = Vue.component("speaker-page", {
  template: "#tpl-pages-speaker",
  props: ['id'],
  filters: { image: image },
  data() {
    return {
      speaker: null,
      title: 'Speaker'
    };
  },
  created() {
    this.init();
  },
  watch: {'$route': 'init'},
  methods: {
    resize: resize,
    init() {
      get_data()
        .then((results) => {
          this.speaker = extract_speaker(results.data, this.id);
          this.title = this.speaker.name;
          console.log(this.speaker);
          this.$router.set_title(this.title);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Speaker;
