document.addEventListener('DOMContentLoaded', () => {
  function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieIndex = parseInt(urlParams.get('index'));

    if (movieIndex) {
      const allMovies = JSON.parse(localStorage.getItem('allMovies'));
      const movie = allMovies[movieIndex];

      if (movie) {
        displayMovieDetails(movie);
      } else {
        console.error('Movie not found');
      }
    } else {
      console.error('Invalid movie index');
    }
  }

  function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movie-details');

    const defaultImageUrl = 'https://via.placeholder.com/300x450.png?text=No+Image+Available';
    const imageUrl = movie.backdropURLs && movie.backdropURLs.original
      ? movie.backdropURLs.original
      : defaultImageUrl;
    const imageUrl2 = movie.posterURLs && movie.posterURLs.original
    ? movie.posterURLs.original
    : defaultImageUrl;

      let castMembersHtml = '';
      for (let i = 0; i < 6 && i < movie.cast.length; i++) {
      castMembersHtml += (i < movie.cast.length - 1) ? `<span>${movie.cast[i]}, </span>` : `<span>${movie.cast[i]}</span>`;
      }

      const youtubeVideoId = movie.youtubeTrailerVideoLink;

    movieDetailsContainer.innerHTML = `
  <h1>${movie.title}</h1>
  <div class="images-container">
  <img src="${imageUrl}" alt="${movie.title}" />
  <img src="${imageUrl2}" alt="${movie.title}" />
  </div>
  <p>${movie.overview}</p>

  <h2>Cast</h2>
  <div class="cast-members">${castMembersHtml}</div>

  <h2>Trailer</h2>
  <a href="${youtubeVideoId}" target="_blank">Watch the trailer on YouTube</a>  `;
  }
  loadMovieDetails();
})