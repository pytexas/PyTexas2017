import Vue from "vue";

import { image } from "../filters";
import ErrorDialog from "../dialogs/error";

var mdPage = Vue.component("md-page", {
  template: "#tpl-pages-md-page",
  props: ["slug"],
  data() {
    return {
      title: "",
      html: "",
      current_dialog: null
    };
  },
  computed: {
    icon() {
      var url_parts = this.$route.path.split("/");

      return image(`img/icons/${url_parts[2]}.svg`);
    }
  },
  created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    init() {
      axios
        .get(URLS.md[this.slug + ".md"])
        .then(response => {
          var converter = new showdown.Converter({ tables: true });

          var text = response.data;
          this.title = text.match(/^# (.*)\n/)[1];
          this.$router.set_title(this.title);
          text = text.replace(/^# .*\n/, "");
          this.html = converter.makeHtml(text);
        })
        .catch(error => {
          console.error(error);

          this.current_dialog = ErrorDialog("Error getting page.", () => {
            this.current_dialog = null;
          });
        });
    }
  }
});

export default mdPage;
