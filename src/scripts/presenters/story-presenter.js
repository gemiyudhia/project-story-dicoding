import createStoryCard from "../components/story-card";
import getAllStories from "../services/story-service";

class StoryPresenter {
  constructor({ listContainer, mapContainer }) {
    this._listContainer = listContainer;
    this._mapContainer = mapContainer;
  }

  async init() {
    try {
      const stories = await getAllStories();

      this._renderList(stories);
      this._renderMap(stories);
    } catch (error) {
      console.error("Error in presenter:", error);
    }
  }

  _renderList(stories) {
    this._listContainer.innerHTML = "";
    stories.forEach((story) => {
      this._listContainer.innerHTML += createStoryCard(story);
    });

    this._listContainer.querySelectorAll(".story-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.hash = `#/stories/${id}`;
      });

      // Akses keyboard (Enter)
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const id = card.getAttribute("data-id");
          window.location.hash = `#/stories/${id}`;
        }
      });
    });
  }

  _renderMap(stories) {
    const map = L.map(this._mapContainer).setView([-6.2, 106.816666], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          <img src="${story.photoUrl}" alt="${story.name}" width="100" /><br>
          ${story.description}
        `);
      }
    });
  }
}

export default StoryPresenter;
