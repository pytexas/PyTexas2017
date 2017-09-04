import Vue from 'vue';

import {image} from '../filters';

export var LINKS = [
  {name: 'About', url: '/page/about/conference'},
  {name: 'Community', url: '/page/community/meetups'}
];

var SideNav = Vue.component('side-nav', {
  template: '#tpl-widgets-side-nav',
  props: ['report_ref'],
  filters: {image: image},
  created() {
    this.report_ref(this);
    
    this.$nextTick(() => {
      var self = this.$refs.rightSidenav;
      self.open = function () {
        self.mdVisible = true;
        //self.$el.focus();
        self.$emit('open');
      };
    });
  },
  data() {
    return {
      links: LINKS
    };
  },
  methods: {
    toggleRightSidenav() {
      this.$refs.rightSidenav.toggle();
    },
    closeRightSidenav() {
      this.$refs.rightSidenav.close();
    },
    open(ref) {
      //console.log('Opened: ' + ref);
    },
    close(ref) {
      //console.log('Closed: ' + ref);
    },
    goto(url) {
      var el = document.querySelector('#app');
      el.scrollTop = 0;
      
      this.closeRightSidenav();
      this.$router.push(url);
    }
  }
});

export default SideNav;
