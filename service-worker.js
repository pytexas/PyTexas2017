var RELEASE = '{{ release }}';
var CACHE_NAME = 'release-{{ release }}';
var CORE_FILES = [
  "/",
  {% for css in css_files %}"{% static css %}",
  {% endfor %}{% for js in js_files %}"{% static js %}",
  {% endfor %}{% for f in fonts %}"{% static f %}",
  {% endfor %}
  
  "{% static "icons/android-chrome-192x192.png" %}",
  "{% static "img/logo-fish.svg" %}"
];

var APP_FILES = [
  "{% url "offline-data" release "kjv" %}"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching');
      cache.addAll(APP_FILES);
      return cache.addAll(CORE_FILES);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(cname) {
          if (cname != CACHE_NAME) {
            console.log('Clearing Cache: ', cname);
            return caches.delete(cname);
          }
        })
      );
    })
  );
});

var APP = null;

self.addEventListener('fetch', function (event) {
  if (event.request.method == "POST" && event.request.url.endsWith("/data-graph")) {
    var ckey = event.request.headers.get('swcache');
    if (ckey) {
      var keys = ckey.split('/');
      var url = `/data/${RELEASE}/${keys[0]}.json`;
      event.respondWith(
        caches.match(url).then(function(response) {
          if (response) {
            var responseInit = {
              status: 200,
              statusText: 'OK',
              headers: {'Content-Type': 'application/json'}
            };
            
            if (APP) {
              console.log('Found Preloaded APP', keys[1], keys[2]);
              var body = APP[keys[1]][keys[2]];
              var mock = new Response(JSON.stringify(body), responseInit);
              return mock;
            }
            
            return response.json().then(function(json) {
              console.log('Found Cache', keys[1], keys[2]);
              APP = json;
              var body = json[keys[1]][keys[2]];
              var mock = new Response(JSON.stringify(body), responseInit);
              return mock;
            });
          }
          
          return fetch(event.request).then(function(response) {
            console.log('Response from network is:', url);
            return response;
          }).catch(function(error) {
            console.error('Fetching failed:', error);
            throw error;
          });
        })
      );
    }
  }
});

self.addEventListener('message', function (event) {
  console.log("SW Received Message: " + event.data);
  event.ports[0].postMessage("ping-back");
});
