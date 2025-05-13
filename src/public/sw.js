const CACHE_NAME = "pwa-cache-v1";

// Daftar file statis untuk application shell dan konten utama
const STATIC_ASSETS = [
  "/", // halaman utama
  "/index.html", // HTML utama
  "/styles/styles.css", // file CSS
  "/index.js", // JavaScript utama
  "/manifest.json", // file manifest
  "/icon.png", // ikon notifikasi
  "/offline.html", // fallback saat offline
];

// Simpan file-file di atas ke dalam cache saat SW di-install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // langsung aktif tanpa menunggu reload
});

// Hapus cache lama saat versi baru diaktifkan
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Tangani permintaan fetch: utamakan cache, fallback ke jaringan
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).catch(() => {
        // Saat offline dan permintaan adalah dokumen HTML, tampilkan offline.html
        if (event.request.destination === "document") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});

// Tangani notifikasi push
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "Notifikasi Baru!";
  const options = {
    body: data.body || "Anda punya pesan baru.",
    icon: "/icon.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
