import Vue from 'vue';

import {image} from '../filters';

var TopBar = Vue.component('top-bar', {
  template: '#tpl-widgets-top-bar',
  filters: {image: image},
  props: ['toggle'],
  data() {
    return {};
  }
});

export default TopBar;
