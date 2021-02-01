/* eslint-env serviceworker */
const CACHE_NAME = 'simplabs-cache-v1';
const JSON_API_CONTENT_TYPE = 'application/vnd.api+json';
const HTML_CONTENT_TYPE = 'text/html';
const FONT_ORIGINS = ['https://fonts.gstatic.com', 'https://fonts.googleapis.com'];

import PRELOAD_ASSETS from './assets/general/paths.js';
import BLOG_CONTENT_PRELOAD_ASSETS from './assets/blog/paths.js';

const PRE_CACHED_ASSETS = [
  '/app.js',
  '/app.css',
  '/calendar.js',
  '/legal.js',
  '/recent.js',
  '/talks.js',
  '/bare-index.html',
].concat(PRELOAD_ASSETS);

function isNavigationRequest(event) {
  return event.request.mode === 'navigate';
}

function isRangeRequest(event) {
  return event.request.headers.get('range');
}

function isCachedAssetRequest(event) {
  let isSameOriginRequest = event.request.url.startsWith(self.location.origin);
  let isFontRequest = FONT_ORIGINS.some((origin) => event.request.url.startsWith(origin));

  return !isNavigationRequest(event) && (isSameOriginRequest || isFontRequest);
}

function isHtmlRequest(event) {
  let isGetRequest = event.request.method === 'GET';
  let isHTMLRequest = event.request.headers.get('accept').startsWith(HTML_CONTENT_TYPE);

  return isNavigationRequest(event) || (isGetRequest && isHTMLRequest);
}

function preload(assets) {
  let now = Date.now();
  return caches.open(CACHE_NAME).then(function (cache) {
    let cachePromises = assets.map(function (asset) {
      return cache.match(asset).then(function (response) {
        if (!response) {
          let url = new URL(asset, location.href);
          if (url.search) {
            url.search += '&';
          }
          url.search += `sw-precache=${now}`;
          let request = new Request(url, { mode: 'no-cors' });
          return fetch(request).then(function (response) {
            if (response.status >= 400) {
              throw new Error('prefetch failed!');
            }
            return cache.put(asset, response);
          });
        }
      });
    });

    return Promise.all(cachePromises);
  });
}

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(preload(PRE_CACHED_ASSETS));
});

self.addEventListener('message', function (event) {
  let { preload: preloadBundle } = event.data;
  if (preloadBundle === 'blog') {
    preload(BLOG_CONTENT_PRELOAD_ASSETS);
  }
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // delete old caches
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }

  if (isCachedAssetRequest(event) && !isRangeRequest(event)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request.clone()).then(function (response) {
              let contentType = response.headers.get('content-type') || '';
              if (response.status < 400 && !contentType.startsWith(JSON_API_CONTENT_TYPE)) {
                cache.put(event.request, response.clone());
              }
              return response;
            });
          }
        });
      }),
    );
  }
});

self.addEventListener('fetch', function (event) {
  if (isHtmlRequest(event)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('bare-index.html');
      }),
    );
  }
});
