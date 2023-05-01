const apiKey = 'fe07250b03msh81b8cdc278ac240p1694d9jsnd3554ffecf3a';
const apiHost = 'streaming-availability.p.rapidapi.com';

function fetchMovies(selectedGenre, selectedLanguage, cursor = null) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': apiKey,
			'X-RapidAPI-Host': apiHost
		}
	};
	const cursorQuery = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';

	const apiUrl = `https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&service=netflix%2Cprime.buy%2Chulu.addon.hbo%2Cpeacock.free&output_language=en&type=all&genre=${selectedGenre}&language=${selectedLanguage}&${cursorQuery}`;
	console.log("API URL:", apiUrl);

	return fetch(apiUrl, options).then(response => response.json());
}

function getRandomMovies(movies, count) {
	const randomMovies = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * movies.length);
		randomMovies.push(movies[randomIndex]);
		movies.splice(randomIndex, 1);
	}
	return randomMovies;
}

function filterMovies() {
	const genreSelector = document.getElementById('genre-selector');
	const languageSelector = document.getElementById('language-selector');

	const selectedGenre = genreSelector.value || '18';
	const selectedLanguage = languageSelector.value || 'en';

	let allMovies = [];
	let cursor = null;
	let hasMore = true;
	let pagesFetched = 0;
	const maxPages = 15;

	function fetchNextPage() {
		if (pagesFetched >= maxPages) {
			hasMore = false;
		}
		fetchMovies(selectedGenre, selectedLanguage, cursor)
			.then(data => {
				allMovies = allMovies.concat(data.result);
				cursor = data.nextCursor;
				hasMore = data.hasMore;

				pagesFetched++;

				if (hasMore && pagesFetched < maxPages) {
					fetchNextPage();
				} else {
					const randomMovies = getRandomMovies(allMovies, 9);
					displayMovies(randomMovies);
				}
			})
			.catch(err => console.error(err));
	}

	fetchNextPage();
}

function displayMovies(moviesToDisplay) {
	localStorage.setItem('allMovies', JSON.stringify(moviesToDisplay));
  
	const gridContainer = document.querySelector('.grid-container');
	gridContainer.innerHTML = '';
	const defaultImageUrl = 'https://via.placeholder.com/300x168.png?text=No+Image+Available';

  
	moviesToDisplay.forEach((movie, index) => {
	  if (!movie) {
		return;
	  }
  
	  const movieElement = document.createElement('div');
	  movieElement.classList.add('movie');
  
	  const imageUrl = movie.backdropURLs && movie.backdropURLs.original
		? movie.backdropURLs.original
		: defaultImageUrl;
  
	  movieElement.innerHTML = `
		<h2>${movie.title}</h2>
		<img src="${imageUrl}" alt="${movie.title}" />
	  `;
	  addTitleClickEventListener(movieElement, index);
	  gridContainer.appendChild(movieElement);
	});
  }

document.addEventListener('DOMContentLoaded', () => {
	document
		.getElementById('search-button')
		.addEventListener('click', filterMovies);
});

function addTitleClickEventListener(movieElement, movieIndex) {
	const movieTitle = movieElement.querySelector('h2');
	movieTitle.style.cursor = 'pointer';
  
	movieTitle.addEventListener('click', () => {
	  window.location.href = `movie-details.html?index=${movieIndex}`;
	});
  }