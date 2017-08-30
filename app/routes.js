import VueRouter from 'vue-router';

import Home from './pages/home';

const NotFound = {template: '#tpl-404'};

export var Routes = [
  {path: '/', name: 'home', component: Home},
  {path: '*', component: NotFound}
];

export var scrolledTo = null;

var router = new VueRouter({
  mode: 'history',
  routes: Routes,
  scrollBehavior: function (to, from, savedPosition) {
    var scrolledTo = {x: 0, y: 0};
    
    if (savedPosition) {
      scrolledTo = savedPosition;
    }
    
    //console.log('scroll', scrolledTo, performance.now());
    return scrolledTo;
  }
});

router.set_title = (to) => {
  var title = '';
  
  if (typeof(to) == 'string') {
    title = to;
  } else if (to.matched && to.matched[0] && to.matched[0].instances && to.matched[0].instances.default) {
    if (to.matched[0].instances.default.title) {
      title = to.matched[0].instances.default.title;
    }
  }
  
  if (title) {
    title += ' \u22C5 PyTexas';
  } else {
    title = 'PyTexas';
  }
  
  document.title = title;
};

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    router.set_title(to);
  });
});

export default router;
