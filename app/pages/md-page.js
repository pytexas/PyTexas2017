import Vue from 'vue';

import ErrorDialog from '../dialogs/error';

var mdPage = Vue.component('md-page', {
  template: '#tpl-pages-md-page',
  props: ['slug'],
  data() {
    return {
      title: '',
      html: '',
      current_dialog: null
    };
  },
  created() {
    this.init();
  },
  watch: {'$route': 'init'},
  methods: {
    init() {
      axios.get(URLS.md[this.slug])
        .then((response) => {
          var converter = new showdown.Converter();
          
          var text = response.data;
          this.title = text.match(/^# (.*)\n/)[1];
          this.$router.set_title(this.title);
          text = text.replace(/^# .*\n/, '');
          this.html = converter.makeHtml(text);
        })
        .catch((error) => {
          console.error(error);
          
          this.current_dialog = ErrorDialog('Error getting page.', () => {
            this.current_dialog = null;
          });
        });
    }
  }
});

export default mdPage;
