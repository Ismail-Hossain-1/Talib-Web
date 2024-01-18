'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "09e9362a02a0f7b774c9b2fd42b5e16e",
"assets/AssetManifest.json": "e8a200be3979ea8dc818200773610176",
"assets/assets/img/earth.jpg": "663797c6b06dfe7425aa188dc982d41d",
"assets/assets/img/holy_sites.png": "a32b8e26953a02996adc1066ff5dc5bb",
"assets/assets/img/jupiter.png": "ebdbf52eff7fe5fc4094b186d6dc3bc8",
"assets/assets/img/Learn.jpg": "2733d827548c5b3543ea134d816a46fb",
"assets/assets/img/mars.jpg": "b3b68b1a38c70ccbccdfbe22456adf29",
"assets/assets/img/mercury.jpg": "cdce877dadf4e6ca6861a69d36b95f5f",
"assets/assets/img/mercury.png": "adcd1444ec1880a8e0294fe917c460fb",
"assets/assets/img/neptune.jpg": "88691b71198429e2aa610aff36dc43f2",
"assets/assets/img/planets.png": "29d6b810ed8b89d0f81a9f8bb5e3a410",
"assets/assets/img/saturn.jpg": "743b88fdc0a5be5003cd1ba0da6567e3",
"assets/assets/img/sun.jpg": "a8ed13c31021ac54347bc67302dc7c01",
"assets/assets/img/test.png": "73ff892285c4444a9122fc5c5859a4f5",
"assets/assets/img/uranus.png": "6317b39a5ca3dbcc59b9294e368ef198",
"assets/assets/img/venus.png": "09c34d4f0ee94bd9aedc512c9c987996",
"assets/assets/islam/kaaba.glb": "6dfa9ba1c9932882b087f4b63a62cf61",
"assets/assets/solar/earth.glb": "f9bc34af685d3354d4bb58bceb66824f",
"assets/assets/solar/jupiter.glb": "f681611bbc5fe9e3d527cda222f7553b",
"assets/assets/solar/mars.glb": "b5184311d2a47ecbfb2c5f0b78af6aca",
"assets/assets/solar/mercury.glb": "db5453b1a39a2ad232a43f3696f50fc2",
"assets/assets/solar/neptune.glb": "d4aa0f822ef0721186c8bcba30c25382",
"assets/assets/solar/saturn.glb": "6d82c8a547e7c222554f32951b8cb89f",
"assets/assets/solar/sun.glb": "e808220fa36d750e7cb0f260be356861",
"assets/assets/solar/uranus.glb": "f3758f02c7fb3c37d8aed28f00581624",
"assets/assets/solar/venus.glb": "b1e03c68af9f807055fa6f569cfc3fde",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "83c095bf7a462ec9b2a65641bbd643e9",
"assets/NOTICES": "a62ff747fad7d994c745033d327cbd81",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/model_viewer_plus/assets/model-viewer.min.js": "4226392bee9372f20a688343e51e7b54",
"assets/packages/model_viewer_plus/assets/template.html": "8de94ff19fee64be3edffddb412ab63c",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
"canvaskit/canvaskit.wasm": "d9f69e0f428f695dc3d66b3a83a4aa8e",
"canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
"canvaskit/chromium/canvaskit.wasm": "393ec8fb05d94036734f8104fa550a67",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icon.jpg": "b8d544210b38a1567288460d5dae8520",
"icons/android-chrome-192x192.png": "c95599ac2724330fa59db48bbb54524d",
"icons/android-chrome-512x512.png": "42b773f7ade4988bf59d368352233788",
"icons/apple-touch-icon.png": "90f7f065885e9898709a837c3994612c",
"icons/icon.jpg": "b8d544210b38a1567288460d5dae8520",
"img.png": "753eaffe510359a7bddb978094df047e",
"index.html": "364b7892d25544219360ef16e1ff1340",
"/": "364b7892d25544219360ef16e1ff1340",
"main.dart.js": "e45aeebf47288c5072d38f7e82327aad",
"manifest.json": "77eb2acb57eab0f93e98c5e0bcc2986c",
"version.json": "f314b32712c589aae07812bc1776497b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
