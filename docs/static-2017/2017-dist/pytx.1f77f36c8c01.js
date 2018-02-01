(function (Vue$1,VueRouter,VueMaterial) {
'use strict';

Vue$1 = Vue$1 && Vue$1.hasOwnProperty('default') ? Vue$1['default'] : Vue$1;
VueRouter = VueRouter && VueRouter.hasOwnProperty('default') ? VueRouter['default'] : VueRouter;
VueMaterial = VueMaterial && VueMaterial.hasOwnProperty('default') ? VueMaterial['default'] : VueMaterial;

function image(path) {
  return IMAGES[path];
}

function resize(url, w, h) {
  if (url.indexOf("gravatar") > -1) {
    return url.replace("s=256", "s=" + w);
  }

  if (DEBUG) {
    return url;
  }

  url = url.replace("https://pytexas.s3.amazonaws.com", "");

  return ("https://pytx.imgix.net" + url + "?w=" + w + "&h=" + h);
}

function time(dt) {
  return dt.toLocaleTimeString();
}

var YEAR = "2017";
var DAYS = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'];

var NAV_LINKS = [
  {
    name: "Talks",
    url: "/program",
    icon: image("img/icons/talks.svg")
  },
  {
    name: "About",
    url: "/page/about/registration",
    icon: image("img/icons/about.svg")
  },
  {
    name: "Location",
    url: "/page/venue",
    icon: image("img/icons/venue.svg")
  },
  {
    name: "Community",
    url: "/page/community/meetups",
    icon: image("img/icons/community.svg")
  },
  {
    name: "Sponsor",
    url: "/page/sponsors/prospectus",
    icon: image("img/icons/sponsors.svg")
  },
  {
    name: "Blog",
    url: "https://medium.com/pytexas",
    external: true,
    icon: image("img/icons/blog.svg")
  }
];

function get_data() {
  return new Promise(function(resolve, reject) {
    if (API_DATA && API_DATA_TS) {
      var diff = Date.now() - API_DATA_TS;
      if (diff > 15 * 60 * 1000) {
        API_DATA = null;
        API_DATA_TS = null;
      }
    }

    if (API_DATA) {
      resolve(JSON.parse(API_DATA));
    } else {
      axios
        .get(("/conference/data/" + YEAR + ".json"))
        .then(function(result) {
          API_DATA = JSON.stringify(result.data);
          API_DATA_TS = Date.now();
          resolve(result.data);
        })
        .catch(function(error) {
          reject(error);
        });
    }
  });
}

function extract_nodes(edges) {
  var extracted = [];

  edges.forEach(function(edge) {
    extracted.push(edge.node);
  });

  return extracted;
}

function extract_sponsors(data) {
  var sponsors = [];
  data.allConfs.edges[0].node.sponsorshiplevelSet.edges.forEach(function(
    level
  ) {
    if (level.node.sponsorSet.edges.length > 0) {
      var formatted = Object.assign({}, level.node);

      formatted.sponsors = extract_nodes(level.node.sponsorSet.edges);
      delete formatted.sponsorSet;

      sponsors.push(formatted);
    }
  });

  return sponsors;
}

function extract_talk(data, id) {
  for (var i = 0; i < data.allSessions.edges.length; i++) {
    var session = data.allSessions.edges[i].node;
    if (session.id == id) {
      return session;
    }
  }
}

function extract_speaker(data, id) {
  for (var i = 0; i < data.allSessions.edges.length; i++) {
    var session = data.allSessions.edges[i].node;
    if (session.user && session.user.id == id) {
      var user = session.user;
      delete session.user;
      user.session = session;
      return user;
    }
  }
}

function extract_sessions(data, day) {
  var sessions = {};

  extract_nodes(data.allSessions.edges).forEach(function(session) {
    session.slug = session.name.toLowerCase().replace(/\s+/g, "-");
    session.start = new Date(session.start);

    var d = session.start.getDate();
    if (sessions[d]) {
      sessions[d].push(session);
    } else {
      sessions[d] = [session];
    }
  });

  return sessions[day].sort(function(a, b) {
    if (a.start < b.start) {
      return -1;
    } else if (a.start > b.start) {
      return 1;
    }

    return 0;
  });
}

function extract_videos(data) {
  var videos = [];

  extract_nodes(data.allSessions.edges).forEach(function(session) {
    session.slug = session.name.toLowerCase().replace(/\s+/g, "-");
    session.start = new Date(session.start);
    
    if (session.videoUrl) {
      var d = session.start.getDay();
      session.day = DAYS[d];
      videos.push(session);
    }
  });

  return videos.sort(function(a, b) {
    if (a.start < b.start) {
      return -1;
    } else if (a.start > b.start) {
      return 1;
    }

    return 0;
  });
}

function extract_keynotes(data) {
  return extract_nodes(data.allKeynotes.edges).map(function(keynote) {
    keynote.slug = keynote.name.toLowerCase().replace(/\s+/g, "-");
    return keynote;
  });
}

var Home = Vue$1.component("home-page", {
  template: "#tpl-pages-home",
  filters: { image: image },
  data: function data() {
    return {
      sponsors: [],
      keynotes: []
    };
  },
  created: function created() {
    this.init();
  },
  methods: {
    resize: resize,
    init: function init() {
      var this$1 = this;

      get_data()
        .then(function (data) {
          this$1.sponsors = extract_sponsors(data);
          this$1.keynotes = extract_keynotes(data);

          var converter = new showdown.Converter({ tables: true });
          this$1.keynotes.forEach(function (keynote) {
            keynote.user.biography = converter.makeHtml(keynote.user.biography);
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }
});

function message_dialog(message, callback, opts) {
  var dialog = {
    template: "#tpl-dialogs-message",
    data: function data() {
      opts = opts || {};

      return {
        message: message,
        title: opts.title || "Message",
        icon: opts.icon || "warning",
        ref: opts.ref || "msgdialog",
        title_class: opts.title_class || "msg"
      };
    },
    mounted: function mounted() {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$refs[this$1.ref].open();
      });
    },
    methods: {
      close: function close() {
        this.$refs[this.ref].close();
      },
      onClose: function onClose() {
        this.$nextTick(function () {
          callback();
        });
      }
    }
  };

  return dialog;
}

function error_dialog$1(message, callback) {
  return message_dialog(message, callback, {
    title: "Error",
    icon: "error_outline",
    ref: "errdialog",
    title_class: "error"
  });
}

var mdPage = Vue$1.component("md-page", {
  template: "#tpl-pages-md-page",
  props: ["slug"],
  data: function data() {
    return {
      title: "",
      html: "",
      current_dialog: null
    };
  },
  computed: {
    icon: function icon() {
      var url_parts = this.$route.path.split("/");

      return image(("img/icons/" + (url_parts[2]) + ".svg"));
    }
  },
  created: function created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    init: function init() {
      var this$1 = this;

      console.log(this.slug);
      axios
        .get(URLS.md[this.slug + ".md"])
        .then(function (response) {
          var converter = new showdown.Converter({ tables: true });

          var text = response.data;
          this$1.title = text.match(/^# (.*)\n/)[1];
          this$1.$router.set_title(this$1.title);
          text = text.replace(/^# .*\n/, "");
          this$1.html = converter.makeHtml(text);
        })
        .catch(function (error) {
          console.error(error);

          this$1.current_dialog = error_dialog$1("Error getting page.", function () {
            this$1.current_dialog = null;
          });
        });
    }
  }
});

var Sponsors = Vue$1.component("sponsors-page", {
  template: "#tpl-pages-sponsors",
  filters: { image: image },
  data: function data() {
    return {
      sponsors: [],
      title: "Sponsors"
    };
  },
  created: function created() {
    this.init();
  },
  methods: {
    resize: resize,
    init: function init() {
      var this$1 = this;

      get_data()
        .then(function (data) {
          this$1.sponsors = extract_sponsors(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }
});

var Program = Vue$1.component("program-page", {
  template: "#tpl-pages-program",
  filters: { image: image, time: time },
  props: ["day"],
  data: function data() {
    return {
      sessions: [],
      rooms: [],
      title: "Program"
    };
  },
  created: function created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    resize: resize,
    init: function init() {
      var this$1 = this;

      if (this.day == 18) {
        this.title = "Saturday 11/18";
      } else {
        this.title = "Sunday 11/19";
      }

      get_data()
        .then(function (data) {
          var sessions = extract_sessions(data, parseInt(this$1.day));
          var date_map = {};
          var structured = [];
          this$1.rooms = [];

          sessions.forEach(function (s) {
            var key = s.start.toLocaleTimeString();
            if (s.room) {
              if (this$1.rooms.indexOf(s.room.id) > -1) {
              } else {
                this$1.rooms.push(s.room.id);
              }
            }

            if (date_map[key]) {
              date_map[key].count += 1;
            } else {
              date_map[key] = { count: 1, allRooms: s.allRooms };
            }
          });

          this$1.rooms.sort();
          var last_date = null;
          sessions.forEach(function(s) {
            var key = s.start.toLocaleTimeString();
            if (date_map[key].allRooms) {
              structured.push(s);
            } else {
              if (date_map[key].count == 2) {
                if (key == last_date) {
                  structured[structured.length - 1][s.room.id] = [s];
                } else {
                  var temp = {};
                  temp[s.room.id] = [s];
                  structured.push(temp);
                }
              } else {
                structured[structured.length - 1][s.room.id].push(s);
              }
            }

            last_date = key;
          });

          this$1.sessions = structured;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }
});

var Session = Vue$1.component("program-session", {
  template: "#tpl-pages-session",
  props: ["session"],
  filters: { image: image, time: time },
  data: function data() {
    return {
      html: ""
    };
  },
  created: function created() {
    var converter = new showdown.Converter({ tables: true });
    this.html = converter.makeHtml(this.session.description);
  },
  watch: {
    session: function(val, oldVal) {
      var converter = new showdown.Converter({ tables: true });
      this.html = converter.makeHtml(this.session.description);
    }
  }
});

var Talk = Vue$1.component("talk-page", {
  template: "#tpl-pages-talk",
  props: ["id"],
  filters: { image: image },
  data: function data() {
    return {
      talk: null,
      title: "Talk",
      html: ""
    };
  },
  created: function created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    resize: resize,
    init: function init() {
      var this$1 = this;

      get_data()
        .then(function (data) {
          this$1.talk = extract_talk(data, this$1.id);
          this$1.title = this$1.talk.name;
          this$1.$router.set_title(this$1.title);

          var converter = new showdown.Converter({ tables: true });
          this$1.html = converter.makeHtml(this$1.talk.description);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }
});

var SOCIAL_INFO = {
  "ABOUT.ME": "https://about.me/",
  FACEBOOK: "https://facebook.com/",
  GITHUB: "https://github.com/",
  GPLUS: "https://plus.google.com/+",
  LINKEDIN: "https://www.linkedin.com/in/",
  TWITTER: "https://twitter.com/"
};

var Speaker = Vue$1.component("speaker-page", {
  template: "#tpl-pages-speaker",
  props: ["id"],
  data: function data() {
    return {
      speaker: null,
      title: "Speaker",
      bio: ""
    };
  },
  created: function created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    image: image,
    resize: resize,
    init: function init() {
      var this$1 = this;

      get_data()
        .then(function (data) {
          this$1.speaker = extract_speaker(data, this$1.id);
          this$1.title = this$1.speaker.name;
          this$1.$router.set_title(this$1.title);

          var converter = new showdown.Converter({ tables: true });
          this$1.bio = converter.makeHtml(this$1.speaker.biography);
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    social_link: function social_link(handle) {
      return SOCIAL_INFO[handle.site] + handle.username;
    },
    social_icon: function social_icon(handle) {
      return image(("img/social/" + (handle.site.toLowerCase()) + ".png"));
    }
  }
});

var Videos = Vue$1.component("video-page", {
  template: "#tpl-pages-videos",
  data: function data() {
    return {
      sessions: []
    };
  },
  created: function created() {
    this.init();
  },
  methods: {
    init: function init() {
      var this$1 = this;

      get_data()
        .then(function (data) {
          this$1.sessions = extract_videos(data);
        });
    }
  }
});

var NotFound = { template: "#tpl-404" };

function current_schedule(to) {
  var d = new Date();
  if (d.getDate() == 19 && d.getMonth() == 10 && d.getFullYear() == 2017) {
    return "/program/19";
  }

  return "/program/18";
}

var Routes = [
  { path: "/page/:slug(.*)", name: "md-page", component: mdPage, props: true },
  { path: "/sponsors", name: "sponsors", component: Sponsors },
  { path: "/program/:day", name: "program", component: Program, props: true },
  { path: "/program", name: "current-program", redirect: current_schedule },
  { path: "/speaker/:id", name: "speaker", component: Speaker, props: true },
  { path: "/talk/:id", name: "talk", component: Talk, props: true },
  { path: "/videos", name: "videos", component: Videos },
  { path: "/", name: "home", component: Home },
  { path: "*", component: NotFound }
];



var router = new VueRouter({
  base: "/2017",
  mode: "history",
  routes: Routes,
  scrollBehavior: function(to, from, savedPosition) {
    // console.log('scroll', savedPosition, performance.now());
    
    return savedPosition || {x: 0, y: 0};
  }
});

router.set_title = function (to) {
  var title = "";

  if (typeof to == "string") {
    title = to;
  } else if (
    to.matched &&
    to.matched[0] &&
    to.matched[0].instances &&
    to.matched[0].instances.default
  ) {
    if (to.matched[0].instances.default.title) {
      title = to.matched[0].instances.default.title;
    }
  }

  if (title) {
    title += " \u22C5 PyTexas";
  } else {
    title = "PyTexas";
  }

  document.title = title;
};

router.afterEach(function (to, from) {
  Vue.nextTick(function () {
    router.set_title(to);
  });
});

var SideNav = Vue$1.component("side-nav", {
  template: "#tpl-widgets-side-nav",
  props: ["report_ref"],
  filters: { image: image },
  created: function created() {
    var this$1 = this;

    this.report_ref(this);

    this.$nextTick(function () {
      var self = this$1.$refs.rightSidenav;
      self.open = function() {
        self.mdVisible = true;
        //self.$el.focus();
        self.$emit("open");
      };
    });
  },
  data: function data() {
    return {
      links: NAV_LINKS
    };
  },
  methods: {
    toggleRightSidenav: function toggleRightSidenav() {
      this.$refs.rightSidenav.toggle();
    },
    closeRightSidenav: function closeRightSidenav() {
      this.$refs.rightSidenav.close();
    },
    open: function open(ref) {
      //console.log('Opened: ' + ref);
    },
    close: function close(ref) {
      //console.log('Closed: ' + ref);
    },
    goto: function goto(url) {
      var el = document.querySelector("#app");
      el.scrollTop = 0;

      this.closeRightSidenav();
      this.$router.push(url);
    }
  }
});

var LeftNav = Vue$1.component("left-nav", {
  template: "#tpl-widgets-left-nav",
  data: function data() {
    return {
      links: NAV_LINKS
    };
  },
  methods: {
    goto: function goto(url) {
      var el = document.querySelector("#app");
      el.scrollTop = 0;
      this.$router.push(url);
    }
  }
});

var TopBar = Vue$1.component("top-bar", {
  template: "#tpl-widgets-top-bar",
  filters: { image: image },
  props: ["toggle"],
  data: function data() {
    return {};
  }
});

var ABOUT_TABS = [
  //{ name: "Register", url: "/page/about/registration" },
  { name: "About The Conference", url: "/page/about/conference" },
  { name: "Privacy Policy", url: "/page/about/privacy" },
  { name: "Code of Conduct", url: "/page/about/code-of-conduct" },
  { name: "Diversity Statement", url: "/page/about/diversity-statement" },
  { name: "Frequently Asked Questions", url: "/page/about/faq" }
];

var COMMUNITY_TABS = [
  { name: "Local Meetups", url: "/page/community/meetups" },
  {
    name: "Chat Room",
    url: "https://pytexas-slack.herokuapp.com/",
    external: true
  },
  { name: "Mailing List", url: "/page/community/mailing-list" },
  { name: "Employers", url: "/page/community/employers" }
];

var SPONSOR_TABS = [
  { name: "Sponsor Prospectus", url: "/page/sponsors/prospectus" },
  { name: "Our Sponsors", url: "/sponsors" }
];

var TALK_TABS = [
  { name: "Saturday 11/18", url: "/program/18" },
  { name: "Sunday 11/19", url: "/program/19" }
];

var SubNav = Vue$1.component("sub-nav", {
  template: "#tpl-widgets-sub-nav",
  watch: { $route: "init" },
  data: function data() {
    return {
      tabs: null
    };
  },
  created: function created() {
    this.init();
  },
  filters: {
    klass: function klass(tab) {
      if (tab.active) {
        return "md-dense md-primary";
      }

      return "md-dense";
    }
  },
  methods: {
    onChange: function onChange(index) {
      var tab = this.tabs[index];
      if (tab.external) {
        window.open(tab.url);
      } else {
        var el = document.querySelector("#app");
        el.scrollTop = 0;
        this.$router.push(this.tabs[index].url);
      }
    },
    init: function init() {
      var this$1 = this;

      this.tabs = null;

      if (this.$route.path.indexOf("/page/about/") === 0) {
        this.tabs = [].concat( ABOUT_TABS );
      } else if (this.$route.path.indexOf("/page/community/") === 0) {
        this.tabs = [].concat( COMMUNITY_TABS );
      } else if (this.$route.path.indexOf("/page/venue/") === 0) {
        this.tabs = null;
      } else if (this.$route.path.indexOf("/sponsors") > -1) {
        this.tabs = [].concat( SPONSOR_TABS );
      } else if (this.$route.path.indexOf("/program") > -1) {
        this.tabs = [].concat( TALK_TABS );
      }

      if (this.tabs) {
        this.tabs.forEach(function (tab) {
          if (tab.url == this$1.$route.path) {
            tab.active = true;
          } else {
            tab.active = false;
          }
        });
      }
    }
  }
});

if (!DEBUG) {
  Raven.config("https://48afdd6633574781814c36e6c0d2a69f@sentry.io/212458")
    .addPlugin(Raven.Plugins.Vue, Vue$1)
    .install();
}

Vue$1.use(VueRouter);
Vue$1.use(VueMaterial);

Vue$1.material.registerTheme("default", {
  primary: { color: "blue", hue: "500" },
  accent: { color: "amber", hue: "700" },
  warn: "red",
  background: "white"
});

var app = new Vue$1({
  el: "#app",
  router: router,
  data: function data() {
    return {
      loading: false,
      update_needed: false
    };
  },
  created: function() {
    var this$1 = this;

    document.querySelector("#splash").remove();
    var app = document.querySelector("#app");
    app.style.display = "block";

    setTimeout(function () {
      this$1.check_update();
    }, 10 * 1000);
  },
  methods: {
    set_load: function set_load(b) {
      this.loading = b;
    },
    check_update: function check_update() {
      var this$1 = this;

      if (UPDATE_NEEDED) {
        this.update_needed = true;
      }

      setTimeout(function () {
        this$1.check_update();
      }, 1000);
    },
    do_update: function do_update() {
      console.log("Doing Update");
      if (REGISTRATION) {
        REGISTRATION.update().then(function() {
          location.reload();
        });
      } else {
        location.reload();
      }
    },
    report_ref: function report_ref(side) {
      this.side = side;
    },
    toggle: function toggle() {
      this.side.toggleRightSidenav();
    }
  }
});

function clear_all_cache(NEWEST_RELEASE) {
  if (
    "serviceWorker" in navigator &&
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

function uninstall () {
  navigator.serviceWorker.getRegistration().then(function(registration) {
    if (registration) {
      console.log('uninstalling');
      registration.unregister();
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    return uninstall();
    
    if (SKIP_SW) {
      start_socket();
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
} else {
  start_socket();
}

function start_socket() {
  // turning off socket for now
  return;
  
  console.log("Starting Socket");
  var url = URLS.main + "/release-stream";

  var ws = new WebSocket(url.replace("http", "ws"));

  ws.onclose = function() {
    console.log("closed restarting socket");
    setTimeout(start_socket, 10000);
  };

  ws.onmessage = function(msg) {
    var r = msg.data;

    console.log("VERSION", r);

    if (r != RELEASE) {
      UPDATE_NEEDED = true;
      API_DATA = null;
      API_DATA_TS = null;
      clear_all_cache(r);
    }
  };
}

function sayswho (){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) { return tem.slice(1).join(' ').replace('OPR', 'Opera'); }
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) { M.splice(1, 1, tem[1]); }
    return M.join(' ');
}

if (sayswho() == 'Safari 10') {
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = URLS.static + 'less/safari-10-sucks.css';
  head.appendChild(link);
}

}(Vue,VueRouter,VueMaterial));
