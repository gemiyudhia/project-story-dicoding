import L from "leaflet";
import addStory from "../../services/add-story";

export default class AddPage {
  async render() {
    return `
      <section class="container">
      <h1>Add New Story</h1>
 
  <form id="storyForm">
    <label>
      Name:
      <input type="text" name="name" id="name" required />
    </label><br /><br />
 
    <label>
      Description:
      <textarea name="description" id="description" required></textarea>
    </label><br /><br />
 
    <video id="camera" autoplay style="max-width:100%; margin-bottom:1rem;"></video>
    <button id="captureBtn" type="button">Capture Photo</button>
    <img id="photoPreview" style="display:none; max-width:100%; margin-top:1rem;" />
    <div id="map" style="height: 300px; margin-top:1rem;"></div>
    <button id="submitBtn" style="margin-top: 1rem;" type="button">Submit Story</button>
    </section>
    </form>
    `;
  }

  async afterRender() {
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");
    const captureBtn = document.getElementById("captureBtn");
    const submitBtn = document.getElementById("submitBtn");
    const descriptionInput = document.getElementById("description");
    const photoPreview = document.getElementById("photoPreview");

    let mediaStream = null;
    let photoBlob = null;
    let selectedLat = null;
    let selectedLon = null;
    let marker = null;

    // Mulai kamera
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access error:", err);
    }

    captureBtn.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob && blob.size > 1024 * 1024) {
          alert("Ukuran gambar maksimal 1MB.");
          return;
        }
        photoBlob = blob;
        photoPreview.src = URL.createObjectURL(blob);
        photoPreview.style.display = "block";

        // Stop kamera setelah ambil foto
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      }, "image/jpeg");
    });

    // Inisialisasi peta Leaflet
    const map = L.map("map").setView([-6.2, 106.8], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Tangkap klik peta dan tampilkan marker
    map.on("click", (e) => {
      selectedLat = e.latlng.lat;
      selectedLon = e.latlng.lng;

      // Tambahkan atau pindahkan marker
      if (marker) {
        marker.setLatLng([selectedLat, selectedLon]);
      } else {
        marker = L.marker([selectedLat, selectedLon]).addTo(map);
      }
    });

    // Submit ke API
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      const desc = descriptionInput.value;
      const token = localStorage.getItem('token')

      if (!photoBlob || !desc || !token) {
        alert("Isi semua data dan pastikan Anda sudah mengambil foto.");
        return;
      }

      try {
        const result = await addStory(
          desc,
          photoBlob,
          selectedLat,
          selectedLon,
          token
        );
        alert("Story submitted!");
        console.log(result);
      } catch (err) {
        console.error(err);
        alert("Failed to submit story");
      }
    });
  }
}
