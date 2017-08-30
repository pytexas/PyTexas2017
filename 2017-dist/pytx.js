(function (Vue$1,VueRouter,VueMaterial) {
'use strict';

Vue$1 = Vue$1 && Vue$1.hasOwnProperty('default') ? Vue$1['default'] : Vue$1;
VueRouter = VueRouter && VueRouter.hasOwnProperty('default') ? VueRouter['default'] : VueRouter;
VueMaterial = VueMaterial && VueMaterial.hasOwnProperty('default') ? VueMaterial['default'] : VueMaterial;

var Home = Vue$1.component('home-page', {
  template: '#tpl-pages-home'
});

var NotFound = {template: '#tpl-404'};

var Routes = [
  {path: '/', name: 'home', component: Home},
  {path: '*', component: NotFound}
];



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

router.set_title = function (to) {
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

router.afterEach(function (to, from) {
  Vue.nextTick(function () {
    router.set_title(to);
  });
});

Vue$1.use(VueRouter);
Vue$1.use(VueMaterial);

Vue$1.material.registerTheme('default', {
  primary: {color: 'blue',  hue: '500'},
  accent: {color: 'amber',  hue: '700'},
  warn: 'red',
  background: 'white'
});

var app = new Vue$1({
  el: '#app',
  router: router,
  data: function data() {
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
    set_load: function set_load(b) {
      this.loading = b;
    }
  }
});

}(Vue,VueRouter,VueMaterial));
