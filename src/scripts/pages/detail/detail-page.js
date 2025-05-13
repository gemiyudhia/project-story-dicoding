import { getStoryById } from "../../services/story-service";

export default class DetailPage {
  async render() {
    return `<section class="container"><div id="story-detail"></div></section>`;
  }

  async afterRender() {
    const url = window.location.hash;
    const id = url.split("/stories/")[1];

    try {
      const story = await getStoryById(id);

      const detailEl = document.getElementById("story-detail");
      detailEl.innerHTML = `
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" alt="${story.name}" width="300" />
        <p>${story.description}</p>
        <p>Dibuat pada: ${new Date(story.createdAt).toLocaleString()}</p>
      `;
    } catch (err) {
      console.error("Gagal mengambil detail:", err);
    }
  }
}
