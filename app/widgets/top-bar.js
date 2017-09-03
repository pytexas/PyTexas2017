import Vue from 'vue';

import {image} from '../filters';

var TopBar = Vue.component('top-bar', {
  template: '#tpl-widgets-top-bar',
  filters: {image: image},
  data() {
    return {
      links: [
        {name: 'About', url: '/page/about/conference'}
      ]
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
      this.closeRightSidenav();
      this.$router.push(url);
    }
  }
});

export default TopBar;
