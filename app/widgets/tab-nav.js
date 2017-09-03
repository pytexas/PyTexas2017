import Vue from 'vue';

var TabNav = Vue.component('tab-nav', {
  template: '#tpl-widgets-tab-nav',
  watch: {'$route': 'init'},
  data() {
    return {
      tabs: null
    };
  },
  created() {
    this.init();
  },
  filters: {
    klass(tab) {
      if (tab.active) {
        return 'md-dense md-primary'
      }
      
      return 'md-dense';
    }
  },
  methods: {
    init() {
      this.tabs = null;
      
      if (this.$route.path.indexOf('/page/about/') === 0) {
        this.tabs = [
          {name: 'About The Conference', url: '/page/about/conference'},
          {name: 'Register', url: '/page/about/registration'},
          {name: 'Privacy Policy', url: '/page/about/privacy'},
          {name: 'Code of Conduct', url: '/page/about/code-of-conduct'},
          {name: 'Diversity Statement', url: '/page/about/diversity-statement'},
          {name: 'Fequently Asked Questions', url: '/page/about/faq'},
        ];
      }
      
      this.tabs.forEach((tab) => {
        if (tab.url == this.$route.path) {
          tab.active = true;
        }
      });
    }
  }
});

export default TabNav;
