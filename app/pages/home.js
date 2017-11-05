import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_sponsors, extract_keynotes } from "../data";

var Home = Vue.component("home-page", {
  template: "#tpl-pages-home",
  filters: { image: image },
  data() {
    return {
      sponsors: [],
      keynotes: []
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
          this.keynotes = extract_keynotes(result.data);
          
          var converter = new showdown.Converter({ tables: true });
          this.keynotes.forEach((keynote) => {
            keynote.user.biography = converter.makeHtml(keynote.user.biography);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export default Home;
