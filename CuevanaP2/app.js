document.addEventListener('DOMContentLoaded', () => {
  // Proteger la ruta
  if (!sessionStorage.getItem('loggedInUser')) {
    window.location.href = 'index.html';
    return;
  }

  // Cerrar sesión
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    });
  }

  // --- Lógica de la app (búsqueda, cards, modal, etc) ---
  const movieContainer = document.getElementById('movie-container');
  const modal = document.getElementById('movie-detail-modal');
  const modalBody = document.getElementById('modal-body');
  const closeButton = document.querySelector('.close-button');
  const searchInput = document.getElementById('search-input');
  const typeSelect = document.getElementById('type-select');
  const searchBtn = document.getElementById('search-btn');

  const API_KEY = '37ef3cd5b668f532b94eaae29ac56827';
  const BASE_URL = 'https://api.themoviedb.org/3';

  let currentQuery = '';
  let currentType = 'all';

  function buildSearchUrl(query, type, page = 1) {
    let url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`;
    return url;
  }
  async function search(query, type, page = 1) {
    movieContainer.innerHTML = '<p>Buscando...</p>';
    const url = buildSearchUrl(query, type, page);
    const res = await fetch(url);
    const data = await res.json();
    showResults(data.results || []);
  }
  function showResults(items) {
    if (!items.length) {
      movieContainer.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }
    movieContainer.innerHTML = '';
    items.forEach(item => {
      if (!item.poster_path) return;
      if (item.media_type === 'person') return;
      if (typeSelect.value !== 'all' && item.media_type !== typeSelect.value) return;
      const card = document.createElement('div');
      card.className = 'movie-item';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.title || item.name}">
        <div class="movie-title">${item.title || item.name}</div>
        <div class="movie-overview">${item.overview ? item.overview.slice(0, 80) + '...' : ''}</div>
      `;
      card.addEventListener('click', () => openModal(item));
      movieContainer.appendChild(card);
    });
  }
  async function openModal(item) {
    const id = item.id;
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    // Detalles
    const [details, credits, images, videos] = await Promise.all([
      fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-ES`).then(r => r.json()),
      fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=es-ES`).then(r => r.json()),
      fetch(`${BASE_URL}/${type}/${id}/images?api_key=${API_KEY}`).then(r => r.json()),
      fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=es-ES`).then(r => r.json())
    ]);
    // Actores principales
    const cast = (credits.cast || []).slice(0, 8);
    // Tráiler
    const trailer = (videos.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    // Modal HTML (sin carrusel de imágenes)
    modalBody.innerHTML = `
      <div class="modal-poster">
        <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name}">
      </div>
      <div class="modal-info">
        <div class="modal-info-main">
          <h3>${details.title || details.name}</h3>
          <p><b>Fecha de lanzamiento:</b> ${details.release_date || details.first_air_date || 'N/A'}</p>
          <p>${details.overview || ''}</p>
          <div class="ranking">⭐ <span>${details.vote_average || '-'}</span></div>
        </div>
        <div class="cast-section">
          <h4>Reparto principal</h4>
          <div class="cast-container">
            ${cast.map(actor => `
              <div class="actor-card">
                <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w185' + actor.profile_path : 'https://via.placeholder.com/100x150?text=Sin+Foto'}" alt="${actor.name}">
                <p>${actor.name}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="trailer-section">
          <h4>Tráiler</h4>
          <div id="trailer-container">
            ${trailer ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>` : '<p>Tráiler no disponible.</p>'}
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'block';
  }
  if (closeButton) closeButton.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  // Búsqueda
  if (searchBtn) searchBtn.onclick = () => {
    currentQuery = searchInput.value.trim();
    currentType = typeSelect.value;
    if (!currentQuery) {
      // Si el input está vacío, muestra el listado inicial
      initializeApp();
      return;
    }
    search(currentQuery, currentType, 1);
  };
  if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });
  if (searchInput) searchInput.addEventListener('input', e => {
    if (searchInput.value.trim() === '') {
      initializeApp();
    }
  });
  // Por defecto, muestra populares
  function initializeApp() {
    search('a', 'all', 1);
  }
  initializeApp();
});
