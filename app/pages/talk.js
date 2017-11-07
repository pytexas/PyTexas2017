import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_talk } from "../data";

var Talk = Vue.component("talk-page", {
  template: "#tpl-pages-talk",
  props: ["id"],
  filters: { image: image },
  data() {
    return {
      talk: null,
      title: "Talk",
      html: ""
    };
  },
  created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    resize: resize,
    init() {
      get_data()
        .then(data => {
          this.talk = extract_talk(data, this.id);
          this.title = this.talk.name;
          this.$router.set_title(this.title);

          var converter = new showdown.Converter({ tables: true });
          this.html = converter.makeHtml(this.talk.description);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Talk;
