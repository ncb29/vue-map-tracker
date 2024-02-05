const CACHE_VERSION = 3;
const CURRENT_CACHE = `main-${CACHE_VERSION}`;
const cacheFiles = [];

if (location.hostname !== "localhost" || location.hostname !== "127.0.0.1") {
    const cacheFiles = [
        './index.html',
        './', // Alias for index.html
        './assets/js/index.js',
        './assets/css/index.css',
        './assets/*.png',
        './assets/*.gif'
    ];
} else {
    const cacheFiles = [
      './index.html',
      './', // Alias for index.html
      './src/App.js',
      './src/App.vue',
      './src/assets/*.css',
      './src/assets/*.svg',
      './src/assets/gifs/*.gif',
      './src/assets/icons/*.png',
      './src/components/*.vue',
      './src/components/*.js',
  ];
}

// On activation we clean up the previously registered service workers
self.addEventListener('activate', evt =>
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CURRENT_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    )
);

// On install we download the routes we want to cache for offline
self.addEventListener('install', evt =>
    evt.waitUntil(
        caches.open(CURRENT_CACHE).then(cache => {
            return cache.addAll(cacheFiles);
        })
    )
);

// Fetch the resource from the network
const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {

        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then(response => {
            clearTimeout(timeoutId);
            fulfill(response);
            update(request);
        }, reject);
    }
);

// Fetch the resource from the browser cache
const fromCache = request =>
    caches
      .open(CURRENT_CACHE)
      .then(cache =>
        cache
            .match(request)
            .then(matching => matching || cache.match('/offline/'))
      );

// Cache the current page to make it available for offline
const update = request =>
    caches
        .open(CURRENT_CACHE)
        .then(cache =>
          fetch(request).then(response => cache.put(request, response))
        );

// General strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', async evt => {
    evt.respondWith(
        fromNetwork(evt.request, 10000).catch(() => fromCache(evt.request))
    );
    evt.waitUntil(update(evt.request));
});