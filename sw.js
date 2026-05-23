const CACHE_NAME = 'fuz-health-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon_192x192.png',
  './icon_512x512.png'
];

// インストール時にキャッシュを保存する処理
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('キャッシュを開いたよ');
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットワークリクエストを横取りして、キャッシュがあればそれを返す処理
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュが見つかればそれを返す
        if (response) {
          return response;
        }
        // なければ通常通りネットワークから取得する
        return fetch(event.request);
      })
  );
});

// 古いキャッシュを消す処理（アップデート用）
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});