import Vue from 'vue';

import {image} from '../filters';

var Home = Vue.component('home-page', {
  template: '#tpl-pages-home',
  filters: {image: image}
});

export default Home;
