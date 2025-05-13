// CSS imports
import '../styles/styles.css';
import CONFIG from './config';

import App from './pages/app';
import { registerPushNotification } from './utils/push-notification';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  const token = localStorage.getItem("token"); // pastikan token ini ada
  if (token) {
    registerPushNotification(token);
  }

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }

  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt event fired"); // Tambahkan ini
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.querySelector("#installBtn");
    installBtn.style.display = "block";

    installBtn.addEventListener("click", () => {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted A2HS prompt");
        } else {
          console.log("User dismissed A2HS prompt");
        }
        deferredPrompt = null;
        installBtn.style.display = "none"; // Sembunyikan lagi setelah klik
      });
    });
  });

  // Fungsi untuk mengambil data dan menyimpannya ke IndexedDB
  const fetchDataAndSave = async () => {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`);
      const data = await response.json();

      // Simpan data ke IndexedDB
      await saveDataToDB(data);

      // Tampilkan data
      displayData(data);
    } catch (error) {
      console.error("Fetching data failed:", error);

      // Jika gagal mengambil data, coba ambil data dari IndexedDB
      const offlineData = await getDataFromDB();
      if (offlineData.length > 0) {
        displayData(offlineData);
      } else {
        // Jika tidak ada data offline, tampilkan pesan
        document.querySelector("#error-message").textContent =
          "Tidak ada data tersedia.";
      }
    }
  };

  // Fungsi untuk menampilkan data
  const displayData = (data) => {
    const container = document.querySelector("#data-container");
    container.innerHTML = "";
    data.forEach((item) => {
      const element = document.createElement("div");
      element.textContent = item.name; // Sesuaikan dengan data yang ada
      container.appendChild(element);
    });
  };

  // Inisialisasi aplikasi dan fetch data saat halaman dimuat
  document.addEventListener("DOMContentLoaded", async () => {
    await fetchDataAndSave();
  });
});
