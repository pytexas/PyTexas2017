import Vue from "vue";
import VueRouter from "vue-router";
import VueMaterial from "vue-material";

import router from "./routes";
import SideNav from "./widgets/side-nav";
import LeftNav from "./widgets/left-nav";
import TopBar from "./widgets/top-bar";
import SubNav from "./widgets/sub-nav";

if (!DEBUG) {
  Raven.config("https://48afdd6633574781814c36e6c0d2a69f@sentry.io/212458")
    .addPlugin(Raven.Plugins.Vue, Vue)
    .install();
}

Vue.use(VueRouter);
Vue.use(VueMaterial);

Vue.material.registerTheme("default", {
  primary: { color: "blue", hue: "500" },
  accent: { color: "amber", hue: "700" },
  warn: "red",
  background: "white"
});

var app = new Vue({
  el: "#app",
  router: router,
  data() {
    return {
      loading: false,
      update_needed: false
    };
  },
  created: function() {
    document.querySelector("#splash").remove();
    var app = document.querySelector("#app");
    app.style.display = "block";

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
      }, 1000);
    },
    do_update() {
      console.log("Doing Update");
      REGISTRATION.update().then(function() {
        //clear_all_cache(NEWEST_RELEASE);
        location.reload();
      });
    },
    report_ref(side) {
      this.side = side;
    },
    toggle() {
      this.side.toggleRightSidenav();
    }
  }
});

function clear_all_cache(NEWEST_RELEASE) {
  if (
    navigator.serviceWorker.controller &&
    navigator.serviceWorker.controller.postMessage
  ) {
    var msg_chan = new MessageChannel();
    msg_chan.port1.onmessage = function(event) {
      console.log("Cache:", event.data);
    };

    navigator.serviceWorker.controller.postMessage(
      { task: "clear", newest_release: NEWEST_RELEASE },
      [msg_chan.port2]
    );
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    if (SKIP_SW) {
      return;
    }

    navigator.serviceWorker.register("/service-worker.js").then(
      function(registration) {
        // Registration was successful
        REGISTRATION = registration;
        start_socket();

        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

function start_socket () {
  console.log('Starting Socket');
  var url = URLS.main + '/release-stream';
  
  var ws = new WebSocket(url.replace('http', 'ws'));
  
  ws.onclose = function () {
    console.log('closed restarting socket');
    setTimeout(start_socket, 10000);
  };
  
  ws.onmessage = function (msg) {
    var r = msg.data;
    
    console.log('VERSION', r);
    
    if (r != RELEASE) {
      UPDATE_NEEDED = true;
      clear_all_cache(r);
    }
  };
}
