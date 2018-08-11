// Service worker install

let cacheNameServer = "restaurantCache-v1";
let filesToCache = [
  '/index.html',
  '/restaurant.html',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
  '/css/styles.css',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/data/restaurants.json'
];

// when 'install' event is triggerd
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheNameServer).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});



self.addEventListener('activate', function(event) {
	event.waitUntil(
    // all caches are retrieved
    caches.keys().then(function (cacheNames) {
      // and for each
      return Promise.all(
        // we filter
        cacheNames.filter(function (cacheName) {
          // selecting those different than the current cache
          return cacheName != cacheNameServer;
        }).map(function (cacheName) {
          // and we delete them
          return caches.delete(cacheName);
        })
      );
    })
  )
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    // the current cache is opened
    caches.open(cacheNameServer).then(function (cache) {
      // we try to fetch the requested response from the internet
      return fetch(event.request).then(function (response) {
        // if we succeed, we add it to cache
        cache.put(event.request, response.clone());
        // and we return it to be used by the app
        return response;
      }).catch(function () {
        // if we don't succeed, we try to take it from the cache
        return caches.match(event.request);
      });
    })
  );
});
