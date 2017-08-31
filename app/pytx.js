import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';

import router from './routes';

Vue.use(VueRouter);
Vue.use(VueMaterial);

Vue.material.registerTheme('default', {
  primary: {color: 'blue',  hue: '500'},
  accent: {color: 'amber',  hue: '700'},
  warn: 'red',
  background: 'white'
});

var app = new Vue({
  el: '#app',
  router: router,
  data() {
    return {
      loading: false
    };
  },
  created: function () {
    document.querySelector('#splash').remove();
    var app = document.querySelector('#app');
    app.style.display = 'block';
  },
  methods: {
    set_load(b) {
      this.loading = b;
    }
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
