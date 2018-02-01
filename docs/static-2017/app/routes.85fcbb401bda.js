import VueRouter from "vue-router";

import Home from "./pages/home";
import mdPage from "./pages/md-page";
import Sponsors from "./pages/sponsors";
import Program from "./pages/program";
import Talk from "./pages/talk";
import Speaker from "./pages/speaker";
import Videos from "./pages/videos";

const NotFound = { template: "#tpl-404" };

function current_schedule(to) {
  var d = new Date();
  if (d.getDate() == 19 && d.getMonth() == 10 && d.getFullYear() == 2017) {
    return "/program/19";
  }

  return "/program/18";
}

export var Routes = [
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

export var scrolledTo = null;

var router = new VueRouter({
  base: "/2017",
  mode: "history",
  routes: Routes,
  scrollBehavior: function(to, from, savedPosition) {
    // console.log('scroll', savedPosition, performance.now());
    
    return savedPosition || {x: 0, y: 0};
  }
});

router.set_title = to => {
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

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    router.set_title(to);
  });
});

export default router;
