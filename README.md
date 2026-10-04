<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>MFLIX</title>

  <script src="https://cdn.jsdelivr.net/npm/@mux/mux-player" defer></script>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #050505;
      color: #fff;
      font-family: Arial, sans-serif;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(5,5,5,.97);
      border-bottom: 1px solid #222;
      padding: 14px 5%;
    }

    .nav {
      max-width: 1400px;
      margin: auto;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      color: #e50914;
      font-size: 30px;
      font-weight: 900;
    }

    .search {
      flex: 1;
    }

    .search input {
      width: 100%;
      padding: 12px 17px;
      border-radius: 25px;
      border: 1px solid #333;
      background: #181818;
      color: white;
      outline: none;
    }

    .upload-btn {
      background: #e50914;
      color: white;
      border: 0;
      border-radius: 7px;
      padding: 11px 16px;
      font-weight: bold;
      cursor: pointer;
    }

    .categories {
      display: flex;
      gap: 9px;
      overflow-x: auto;
      padding: 13px 5%;
      scrollbar-width: none;
    }

    .categories::-webkit-scrollbar {
      display: none;
    }

    .category {
      white-space: nowrap;
      border: 1px solid #333;
      background: #191919;
      color: #ddd;
      padding: 9px 15px;
      border-radius: 20px;
      cursor: pointer;
    }

    .category:hover {
      background: #e50914;
      color: white;
    }

    /* HERO */

    .hero {
      min-height: 520px;
      display: flex;
      align-items: end;
      padding: 60px 5%;
      background:
        linear-gradient(to top, #050505 3%, transparent 70%),
        linear-gradient(to right, #050505 5%, transparent 70%),
        url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85")
        center/cover;
    }

    .hero-content {
      max-width: 650px;
    }

    .hero h1 {
      font-size: clamp(40px, 8vw, 75px);
      margin-bottom: 15px;
    }

    .hero p {
      color: #ddd;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .hero button {
      border: 0;
      border-radius: 7px;
      padding: 13px 24px;
      background: #e50914;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    /* MOVIES */

    .movie-section {
      padding: 25px 0;
    }

    .movie-section h2 {
      margin: 0 5% 15px;
      font-size: 23px;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 15px;
      padding: 0 5%;
    }

    .movie-card {
      background: #111;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform .2s;
    }

    .movie-card:hover {
      transform: scale(1.03);
    }

    .movie-card img {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      display: block;
    }

    .movie-info {
      padding: 10px;
    }

    .movie-title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .movie-meta {
      color: #999;
      font-size: 13px;
      margin-top: 6px;
    }

    .empty {
      color: #888;
      padding: 20px 5%;
    }

    /* PLAYER */

    .player-modal {
      position: fixed;
      inset: 0;
      z-index: 5000;
      display: none;
      background: #000;
      overflow-y: auto;
    }

    .player-modal.active {
      display: block;
    }

    .close-player {
      position: fixed;
      right: 18px;
      top: 15px;
      z-index: 5100;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 50%;
      background: rgba(0,0,0,.75);
      color: white;
      font-size: 28px;
      cursor: pointer;
    }

    #mflixPlayer {
      width: 100%;
      height: min(75vh, 800px);
      background: #000;
    }

    .player-details {
      max-width: 1000px;
      margin: auto;
      padding: 20px 5%;
    }

    .player-details h2 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    .player-details p {
      color: #bbb;
      line-height: 1.6;
    }

    .player-action {
      margin-top: 18px;
      background: #e50914;
      color: white;
      border: 0;
      padding: 12px 20px;
      border-radius: 7px;
      font-weight: bold;
      cursor: pointer;
    }

    /* UPLOAD */

    .upload-modal {
      position: fixed;
      inset: 0;
      z-index: 6000;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,.9);
      padding: 20px;
    }

    .upload-modal.active {
      display: flex;
    }

    .upload-box {
      width: 100%;
      max-width: 520px;
      background: #151515;
      border-radius: 12px;
      padding: 25px;
    }

    .upload-box h2 {
      margin-bottom: 20px;
    }

    .upload-box input,
    .upload-box textarea,
    .upload-box select {
      width: 100%;
      margin-bottom: 12px;
      padding: 12px;
      border: 1px solid #333;
      border-radius: 7px;
      background: #090909;
      color: white;
    }

    .upload-box textarea {
      min-height: 100px;
    }

    .publish {
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 7px;
      background: #e50914;
      color: white;
      font-weight: bold;
    }

    .cancel {
      width: 100%;
      margin-top: 8px;
      padding: 12px;
      border: 1px solid #444;
      border-radius: 7px;
      background: transparent;
      color: white;
    }

    @media(max-width:600px) {

      .logo {
        font-size: 24px;
      }

      .nav {
        gap: 8px;
      }

      .upload-btn {
        padding: 9px 11px;
      }

      .hero {
        min-height: 430px;
      }

      .movie-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      #mflixPlayer {
        height: 48vh;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="nav">

    <div class="logo">MFLIX</div>

    <div class="search">
      <input
        id="searchInput"
        type="search"
        placeholder="Search movies and series..."
        oninput="searchMovies()">
    </div>

    <button class="upload-btn" onclick="openUpload()">
      Upload
    </button>

  </div>
</header>

<!-- CATEGORIES -->

<div class="categories">

  <button class="category"
    onclick="filterCategory('Entertainment')">
    Entertainment
  </button>

  <button class="category"
    onclick="filterCategory('Comedy')">
    Comedy
  </button>

  <button class="category"
    onclick="filterCategory('Sports')">
    Sports
  </button>

  <button class="category"
    onclick="filterCategory('Music')">
    Music
  </button>

  <button class="category"
    onclick="filterCategory('Kids')">
    Kids
  </button>

  <button class="category"
    onclick="filterCategory('Education')">
    Education
  </button>

</div>

<!-- HERO -->

<section class="hero">

  <div class="hero-content">

    <h1 id="heroTitle">MFLIX</h1>

    <p id="heroDescription">
      Stream your favorite movies and series on MFLIX.
    </p>

    <button onclick="playHeroMovie()">
      ▶ Play
    </button>

  </div>

</section>

<!-- MOVIE SECTIONS -->

<section class="movie-section">

  <h2>Most Popular</h2>

  <div id="mostPopular" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Action Movies</h2>

  <div id="actionMovies" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Horror Movies</h2>

  <div id="horrorMovies" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Fantasy</h2>

  <div id="fantasyMovies" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Marvel Movies</h2>

  <div id="marvelMovies" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>DC Movies</h2>

  <div id="dcMovies" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Animations</h2>

  <div id="animations" class="movie-grid"></div>

</section>

<section class="movie-section">

  <h2>Most Popular Series</h2>

  <div id="series" class="movie-grid"></div>

</section>

<!-- PLAYER -->

<div id="playerModal" class="player-modal">

  <button
    class="close-player"
    onclick="closePlayer()">
    ×
  </button>

  <mux-player
    id="mflixPlayer"
    stream-type="on-demand"
    controls
    playsinline>
  </mux-player>

  <div class="player-details">

    <h2 id="playerTitle">MFLIX</h2>

    <p id="playerDescription"></p>

    <button
      class="player-action"
      onclick="downloadSelectedMovie()">
      Download
    </button>

  </div>

</div>

<!-- UPLOAD -->

<div id="uploadModal" class="upload-modal">

  <div class="upload-box">

    <h2>Upload Movie</h2>

    <input
      id="uploadTitle"
      placeholder="Movie title">

    <textarea
      id="uploadDescription"
      placeholder="Description"></textarea>

    <input
      id="uploadPoster"
      placeholder="Poster URL">

    <input
      id="uploadVideo"
      type="file"
      accept="video/*">

    <select id="uploadCategory">

      <option>Most Popular</option>
      <option>Action Movies</option>
      <option>Horror Movies</option>
      <option>Fantasy</option>
      <option>Marvel Movies</option>
      <option>DC Movies</option>
      <option>Animations</option>
      <option>Most Popular Series</option>

    </select>

    <input
      id="uploadYear"
      type="number"
      placeholder="Release year">

    <button
      class="publish"
      onclick="publishMovie()">
      Publish
    </button>

    <button
      class="cancel"
      onclick="closeUpload()">
      Cancel
    </button>

  </div>

</div>

<script>

/* =========================
   CURRENT MFLIX BACKEND
========================= */

const API_BASE =
  "https://mflix-backend-l2yu.onrender.com";


/* =========================
   APP STATE
========================= */

let movies = [];

let selectedMovie = null;

let heroMovie = null;


/* =========================
   LOAD MOVIES
========================= */

async function loadMovies() {

  try {

    const response =
      await fetch(
        `${API_BASE}/api/movies`
      );

    if (!response.ok) {

      throw new Error(
        `API error ${response.status}`
      );

    }

    const data =
      await response.json();

    if (Array.isArray(data)) {

      movies = data;

    } else if (
      Array.isArray(data.movies)
    ) {

      movies = data.movies;

    } else if (
      Array.isArray(data.data)
    ) {

      movies = data.data;

    } else {

      movies = [];

    }

    console.log(
      "MFLIX movies:",
      movies
    );

    renderAll();

    if (movies.length > 0) {

      heroMovie = movies[0];

      updateHero(heroMovie);

    }

  } catch (error) {

    console.error(
      "MFLIX API error:",
      error
    );

    document.getElementById(
      "mostPopular"
    ).innerHTML =
      `<div class="empty">
        Unable to load movies from MFLIX.
      </div>`;

  }

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   MOVIE CARD
========================= */

function movieCard(movie) {

  const poster =
    movie.poster ||
    "https://via.placeholder.com/500x750?text=MFLIX";

  const title =
    movie.title ||
    "Untitled";

  const year =
    movie.year || "";

  const rating =
    movie.rating
      ? `⭐ ${movie.rating}`
      : "";

  return `

    <div
      class="movie-card"
      data-movie-id="${escapeHtml(movie.id)}"
      onclick="playMovieById('${escapeHtml(movie.id)}')">

      <img
        src="${escapeHtml(poster)}"
        alt="${escapeHtml(title)}"
        loading="lazy">

      <div class="movie-info">

        <div class="movie-title">
          ${escapeHtml(title)}
        </div>

        <div class="movie-meta">
          ${escapeHtml(year)}
          ${escapeHtml(rating)}
        </div>

      </div>

    </div>

  `;

}


/* =========================
   RENDER
========================= */

function renderMovies(elementId, list) {

  const element =
    document.getElementById(elementId);

  if (!element) return;

  if (!list.length) {

    element.innerHTML =
      `<div class="empty">
        No movies yet.
      </div>`;

    return;

  }

  element.innerHTML =
    list.map(movieCard).join("");

}


function renderAll() {

  renderMovies(
    "mostPopular",
    movies
  );

  renderMovies(
    "actionMovies",
    categoryMovies("Action Movies")
  );

  renderMovies(
    "horrorMovies",
    categoryMovies("Horror Movies")
  );

  renderMovies(
    "fantasyMovies",
    categoryMovies("Fantasy")
  );

  renderMovies(
    "marvelMovies",
    categoryMovies("Marvel Movies")
  );

  renderMovies(
    "dcMovies",
    categoryMovies("DC Movies")
  );

  renderMovies(
    "animations",
    categoryMovies("Animations")
  );

  renderMovies(
    "series",
    categoryMovies("Most Popular Series")
  );

}


function categoryMovies(category) {

  return movies.filter(movie =>

    String(movie.category || "")
      .toLowerCase()
      .includes(
        category.toLowerCase()
      )

  );

}


/* =========================
   FIND MOVIE
========================= */

function getMovieById(id) {

  return movies.find(
    movie => String(movie.id) === String(id)
  );

}


/* =========================
   PLAY MOVIE
========================= */

function playMovieById(id) {

  const movie =
    getMovieById(id);

  if (movie) {

    playMovie(movie);

  }

}


function playMovie(movie) {

  const playbackId =
    movie.playbackId ||
    movie.muxPlaybackId;

  if (!playbackId) {

    alert(
      "This movie does not have a Mux playback ID yet."
    );

    return;

  }

  selectedMovie = movie;

  const player =
    document.getElementById(
      "mflixPlayer"
    );

  player.setAttribute(
    "playback-id",
    playbackId
  );

  player.setAttribute(
    "stream-type",
    "on-demand"
  );

  document.getElementById(
    "playerTitle"
  ).textContent =
    movie.title || "MFLIX";

  document.getElementById(
    "playerDescription"
  ).textContent =
    movie.description || "";

  document.getElementById(
    "playerModal"
  ).classList.add("active");

  document.body.style.overflow =
    "hidden";

}


/* =========================
   PLAY HERO
========================= */

function playHeroMovie() {

  if (heroMovie) {

    playMovie(heroMovie);

  }

}


/* =========================
   CLOSE PLAYER
========================= */

function closePlayer() {

  document.getElementById(
    "playerModal"
  ).classList.remove("active");

  document.body.style.overflow =
    "";

  const player =
    document.getElementById(
      "mflixPlayer"
    );

  try {

    player.pause();

  } catch (error) {}

}


/* =========================
   SEARCH
========================= */

function searchMovies() {

  const query =
    document.getElementById(
      "searchInput"
    ).value
    .toLowerCase()
    .trim();

  if (!query) {

    renderAll();

    return;

  }

  const results =
    movies.filter(movie => {

      const title =
        String(movie.title || "")
          .toLowerCase();

      const description =
        String(movie.description || "")
          .toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query)
      );

    });

  renderMovies(
    "mostPopular",
    results
  );

}


/* =========================
   CATEGORY FILTER
========================= */

function filterCategory(category) {

  const results =
    movies.filter(movie =>

      String(movie.category || "")
        .toLowerCase()
        .includes(
          category.toLowerCase()
        )

    );

  renderMovies(
    "mostPopular",
    results
  );

}


/* =========================
   DOWNLOAD
========================= */

async function downloadSelectedMovie() {

  if (!selectedMovie) {

    alert(
      "Select a movie first."
    );

    return;

  }

  if (!selectedMovie.downloadUrl) {

    alert(
      "This movie is currently available for streaming, but an offline download file has not been provided yet."
    );

    return;

  }

  window.location.href =
    selectedMovie.downloadUrl;

}


/* =========================
   UPLOAD MODAL
========================= */

function openUpload() {

  document.getElementById(
    "uploadModal"
  ).classList.add("active");

}


function closeUpload() {

  document.getElementById(
    "uploadModal"
  ).classList.remove("active");

}


/* =========================
   PUBLISH
========================= */

async function publishMovie() {

  const title =
    document.getElementById(
      "uploadTitle"
    ).value.trim();

  const description =
    document.getElementById(
      "uploadDescription"
    ).value.trim();

  const poster =
    document.getElementById(
      "uploadPoster"
    ).value.trim();

  const category =
    document.getElementById(
      "uploadCategory"
    ).value;

  const year =
    Number(
      document.getElementById(
        "uploadYear"
      ).value
    );

  if (!title) {

    alert(
      "Enter the movie title."
    );

    return;

  }

  try {

    const response =
      await fetch(
        `${API_BASE}/api/movies`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            title,
            description,
            poster,
            category,
            year

          })

        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error ||
        "Movie could not be published."
      );

    }

    alert(
      "Movie published successfully."
    );

    closeUpload();

    await loadMovies();

  } catch (error) {

    console.error(error);

    alert(
      "Publish failed: " +
      error.message
    );

  }

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  loadMovies
);

</script>

</body>
</html>
