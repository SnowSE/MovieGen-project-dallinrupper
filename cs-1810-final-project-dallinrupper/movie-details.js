function loadMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieIndex = parseInt(urlParams.get('index'));

  if (!isNaN(movieIndex)) {
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

  movieDetailsContainer.innerHTML = `
    <h1>${movie.title}</h1>
    <img src="${imageUrl}" alt="${movie.title}" />
    <p>${movie.description}</p>
  `;
}