import StoryPresenter from "../../presenters/story-presenter";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <ul id="story-list" class="story-list"></ul>
        <div class="detail-location">
          <h3><i class="fas fa-map-marker-alt"></i> Lokasi</h3>
          <div id="detail-map" style="height: 400px;"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new StoryPresenter({
      listContainer: document.getElementById("story-list"),
      mapContainer: "detail-map",
    });

    await presenter.init();
  }
}
