import Vue from "vue";

export var ABOUT_TABS = [
  { name: "Register", url: "/page/about/registration" },
  { name: "About The Conference", url: "/page/about/conference" },
  { name: "Privacy Policy", url: "/page/about/privacy" },
  { name: "Code of Conduct", url: "/page/about/code-of-conduct" },
  { name: "Diversity Statement", url: "/page/about/diversity-statement" },
  { name: "Frequently Asked Questions", url: "/page/about/faq" }
];

export var COMMUNITY_TABS = [
  { name: "Local Meetups", url: "/page/community/meetups" },
  {
    name: "Chat Room",
    url: "https://gitter.im/pytexas/PyTexas",
    external: true
  },
  { name: "Mailing List", url: "/page/community/mailing-list" },
  { name: "Employers", url: "/page/community/employers" }
];

export var SPONSOR_TABS = [
  { name: "Sponsor Prospectus", url: "/page/sponsors/prospectus" },
  { name: "Our Sponsors", url: "/sponsors" }
];

export var TALK_TABS = [
  { name: "Saturday 11/18", url: "/program/18" },
  { name: "Sunday 11/19", url: "/program/19" },
];

var SubNav = Vue.component("sub-nav", {
  template: "#tpl-widgets-sub-nav",
  watch: { $route: "init" },
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
        return "md-dense md-primary";
      }

      return "md-dense";
    }
  },
  methods: {
    onChange(index) {
      var tab = this.tabs[index];
      if (tab.external) {
        window.open(tab.url);
      } else {
        var el = document.querySelector("#app");
        el.scrollTop = 0;
        this.$router.push(this.tabs[index].url);
      }
    },
    init() {
      this.tabs = null;

      if (this.$route.path.indexOf("/page/about/") === 0) {
        this.tabs = [...ABOUT_TABS];
      } else if (this.$route.path.indexOf("/page/community/") === 0) {
        this.tabs = [...COMMUNITY_TABS];
      } else if (this.$route.path.indexOf("/page/venue/") === 0) {
        this.tabs = null;
      } else if (this.$route.path.indexOf("/sponsors") > -1) {
        this.tabs = [...SPONSOR_TABS];
      } else if (this.$route.path.indexOf("/program") > -1) {
        this.tabs = [...TALK_TABS];
      }

      if (this.tabs) {
        this.tabs.forEach(tab => {
          if (tab.url == this.$route.path) {
            tab.active = true;
          } else {
            tab.active = false;
          }
        });
      }
    }
  }
});

export default SubNav;
