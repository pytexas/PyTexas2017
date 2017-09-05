import Vue from 'vue';

import {image} from '../filters';

export var LINKS = [
  {
    name: 'Chat Room',
    url: 'https://gitter.im/pytexas/PyTexas',
    external: true,
    icon: image('img/icons/chat.svg')
  },
  {
    name: 'Sponsor',
    url: '/page/sponsors/prospectus',
    icon: image('img/icons/sponsors.svg')
  },
  {
    name: 'About',
    url: '/page/about/conference',
    icon: image('img/icons/about.svg')
  },
  {
    name: 'Venue',
    url: '/page/venue/map',
    icon: image('img/icons/venue.svg')
  },
  {
    name: 'Community',
    url: '/page/community/meetups',
    icon: image('img/icons/community.svg')
  },
  {
    name: 'Blog',
    url: 'https://medium.com/pytexas',
    external: true,
    icon: image('img/icons/blog.svg')
  }
];

var LeftNav = Vue.component('left-nav', {
  template: '#tpl-widgets-left-nav',
  filters: {image: image},
  data() {
    return {
      links: LINKS
    };
  },
  methods: {
    /*
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
    */
    goto(url) {
      var el = document.querySelector('#app');
      el.scrollTop = 0;

      this.closeRightSidenav();
      this.$router.push(url);
    }
  }
});

export default LeftNav;
