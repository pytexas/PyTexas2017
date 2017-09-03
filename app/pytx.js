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
      loading: false,
      update_needed: false
    };
  },
  created: function () {
    document.querySelector('#splash').remove();
    var app = document.querySelector('#app');
    app.style.display = 'block';
    
    setTimeout(() => {
      this.check_update();
    }, 10 * 1000);
  },
  methods: {
    set_load(b) {
      this.loading = b;
    },
    check_update() {
      if (UPDATE_NEEDED) {
        this.update_needed = true;
      }
      
      setTimeout(() => {
        this.check_update();
      }, 60 * 1000);
    },
    do_update() {
      console.log('Doing Update');
      REGISTRATION.update()
        .then(function () {
          clear_all_cache();
        });
    }
  }
});

function clear_all_cache () {
  if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage) {
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function (event) {
      console.log('Cache:', event.data);
      location.reload();
    };
    
    navigator.serviceWorker.controller.postMessage("clear", [msg_chan.port2]);
  }
}

var CHECK_RELEASE_INTERVAL = 5 * 60 * 1000;
if (DEBUG) {
  CHECK_RELEASE_INTERVAL = 20 * 1000;
}

var intervalID = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      // Registration was successful
      REGISTRATION = registration;
      check_release();
      intervalID = setInterval(check_release, CHECK_RELEASE_INTERVAL);
      
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

function get_sw_release () {
  if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage) {
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function (event) {
      console.log('SW Release', event.data);
      SW_RELEASE = event.data;
    };
    
    navigator.serviceWorker.controller.postMessage("release", [msg_chan.port2]);
  }
}

function check_release () {
  console.log("Checking Release", SW_RELEASE);
  if (REGISTRATION) {
    if (SW_RELEASE) {
      axios.get("/release?ts=" + Date.now())
        .then((response) => {
          console.log(response.data.release, SW_RELEASE);
          if (response.data.release != SW_RELEASE) {
            console.log('UPDATE NEEDED');
            UPDATE_NEEDED = true;
            clearInterval(intervalID);
          }
        })
        .catch((e) => {
          
        });
    } else {
      get_sw_release();
    }
  }
}
