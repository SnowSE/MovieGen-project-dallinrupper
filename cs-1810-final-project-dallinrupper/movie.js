class MovieFetcher 
{
	constructor(apiKey, apiHost) {
	  this.apiKey = apiKey;
	  this.apiHost = apiHost;
	  this.pagesFetched = 0;
	  this.maxPages = 15;
	}
  
	fetchMovies(selectedGenre, selectedLanguage, checkedServices, cursor = null) {
	  const options = {
		method: 'GET',
		headers: {
		  'X-RapidAPI-Key': this.apiKey,
		  'X-RapidAPI-Host': this.apiHost,
		},
	  };
	  const cursorQuery = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
  
	  const apiUrl = `https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&service=${checkedServices}&output_language=${selectedLanguage}&type=all&genre=${selectedGenre}&language=${selectedLanguage}&${cursorQuery}`;
	  console.log('API URL:', apiUrl);
  
	  return fetch(apiUrl, options).then(response => response.json());
	}
  
	getRandomMovies(movies, count) {
	  const randomMovies = [];
	  for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * movies.length);
		randomMovies.push(movies[randomIndex]);
		movies.splice(randomIndex, 1);
	  }
	  return randomMovies;
	}

	toggleLoading(loading) {
		const loadingElement = document.getElementById('loading');
		loadingElement.style.display = loading ? 'block' : 'none';
	  }
  
	filterMovies() {
		const genreSelector = document.getElementById('genre-selector');
		const languageSelector = document.getElementById('language-selector');
		const streamingServices = Array.from(document.getElementsByName('streaming-service'));
	  
		const selectedGenre = genreSelector.value;
		const selectedLanguage = languageSelector.value;
	  
		const checkedServices = streamingServices
		  .filter(checkbox => checkbox.checked)
		  .map(checkbox => checkbox.value)
		  .join('%2C');
	  
		let allMovies = [];
		let cursor = null;
		let hasMore = true;
		this.maxPages = 15;
		this.pagesFetched = 0;
	  
		this.toggleLoading(true); // Show the loading image
	  
		const fetchNextPage = () => {
		  if (this.pagesFetched >= this.maxPages) {
			hasMore = false;
		  }
		  this.fetchMovies(selectedGenre, selectedLanguage, checkedServices, cursor)
			.then(data => {
			  allMovies = allMovies.concat(data.result);
			  cursor = data.nextCursor;
			  hasMore = data.hasMore;
	  
			  this.pagesFetched++;
	  
			  if (hasMore && this.pagesFetched < this.maxPages) {
				fetchNextPage();
			  } else {
				const randomMovies = this.getRandomMovies(allMovies, 9);
				this.displayMovies(randomMovies);
				this.toggleLoading(false); // Hide the loading image
			  }
			})
			.catch(err => {
			  console.error(err);
			  this.toggleLoading(false); // Hide the loading image in case of an error
			});
		};
	  
		fetchNextPage();
	  }
  
	displayMovies(moviesToDisplay) {
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
		  this.addTitleClickEventListener(movieElement, index);
		  gridContainer.appendChild(movieElement);
		});
	  }
	
	  addTitleClickEventListener(movieElement, movieIndex) {
		const movieTitle = movieElement.querySelector('h2');
		movieTitle.style.cursor = 'pointer';
	
		movieTitle.addEventListener('click', () => {
		  window.location.href = `movie-details.html?index=${movieIndex}`;
		});
	  }
	}
	
	document.addEventListener('DOMContentLoaded', () => {
	  const apiKey = 'fe07250b03msh81b8cdc278ac240p1694d9jsnd3554ffecf3a';
	  const apiHost = 'streaming-availability.p.rapidapi.com';
	  const movieFetcher = new MovieFetcher(apiKey, apiHost);
	
	  document
		.getElementById('search-button')
		.addEventListener('click', () => movieFetcher.filterMovies());
	});
  