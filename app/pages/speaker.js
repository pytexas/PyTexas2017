import Vue from "vue";

import { image, resize } from "../filters";
import { get_data, extract_speaker } from "../data";

var SOCIAL_INFO = {
  'ABOUT.ME': 'https://about.me/',
  'FACEBOOK': 'https://facebook.com/',
  'GITHUB': 'https://github.com/',
  'GPLUS': 'https://plus.google.com/+',
  'LINKEDIN': 'https://www.linkedin.com/in/',
  'TWITTER': 'https://twitter.com/',
};

var Speaker = Vue.component("speaker-page", {
  template: "#tpl-pages-speaker",
  props: ['id'],
  data() {
    return {
      speaker: null,
      title: 'Speaker',
      bio: ''
    };
  },
  created() {
    this.init();
  },
  watch: {'$route': 'init'},
  methods: {
    image: image,
    resize: resize,
    init() {
      get_data()
        .then((results) => {
          this.speaker = extract_speaker(results.data, this.id);
          this.title = this.speaker.name;
          this.$router.set_title(this.title);
          
          var converter = new showdown.Converter({ tables: true });
          this.bio = converter.makeHtml(this.speaker.biography);
        })
        .catch(error => {
          console.error(error);
        });
    },
    social_link(handle) {
      return SOCIAL_INFO[handle.site] + handle.username;
    },
    social_icon(handle) {
      return image(`img/social/${handle.site.toLowerCase()}.png`);
    }
  }
});

export default Speaker;
