const CACHE_NAME = 'tic-tac-toe-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/logo.png',
  '/manifest.json',  // Add manifest to cache
  'https://unpkg.com/boxicons/css/boxicons.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap'
];

// Install Service Worker and cache all necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );const CACHE_NAME = 'tic-tac-toe-cache-v2';
  const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/logo.png',  // Your favicon
    '/manifest.json',
    'https://unpkg.com/boxicons/css/boxicons.min.css',  // External styles
  ];
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  });
  
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
});

// Fetch cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activate the new service worker and remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
