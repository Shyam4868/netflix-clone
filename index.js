
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const goToWatchlistBtn = document.getElementById('goToWatchlist');


goToWatchlistBtn.addEventListener('click', () => {
    window.location.href = 'watchList/watchlist.html';
});

const scrollDistance = 900;


function setupScroll(containerClass, previousButtonClass, nextButtonClass) {
    const previousButtons = document.querySelectorAll(`.${previousButtonClass}`);
    const nextButtons = document.querySelectorAll(`.${nextButtonClass}`);
    const containers = document.querySelectorAll(`.${containerClass}`);

    containers.forEach((container, index) => {
        const previousButton = previousButtons[index];
        const nextButton = nextButtons[index];
        nextButton.addEventListener('click', () => {
            container.scrollBy({
                left: scrollDistance,
                behavior: 'smooth',
            });
        });
        previousButton.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth',
            });
        });
    });
}


setupScroll('trending-container', 'trending-previous', 'trending-next');
setupScroll('netflix-container', 'netflix-previous', 'netflix-next');
setupScroll('netflixShows-container', 'netflixShows-previous', 'netflixShows-next');
setupScroll('top-container', 'top-previous', 'top-next');
setupScroll('horror-container', 'horror-previous', 'horror-next');
setupScroll('comedy-container', 'comedy-previous', 'comedy-next');
setupScroll('action-container', 'action-previous', 'action-next');
setupScroll('romantic-container', 'romantic-previous', 'romantic-next');


const api_Key = '7f05665f8077163d26b07db047347cb2';



function fetchMedia(containerClass, endpoint, mediaType) {
    const containers = document.querySelectorAll(`.${containerClass}`);
    containers.forEach((container) => {
        fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${api_Key}`)
            .then(response => response.json())
            .then(data => {
                const fetchResults = data.results;
                fetchResults.forEach(item => {
                    const itemElement = document.createElement('div');
                    const imageUrl = containerClass === 'netflix-container' ? item.poster_path : item.backdrop_path;
                    itemElement.innerHTML = ` <img src="https://image.tmdb.org/t/p/w500${imageUrl}" alt="${item.title || item.name}"> `;
                    container.appendChild(itemElement);

                    itemElement.addEventListener('click', () => {
                        const media_Type = item.media_type || mediaType
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${item.id}`;
                    });
                });

                if (containerClass === 'netflix-container') {
                    const randomIndex = Math.floor(Math.random() * fetchResults.length);
                    const randomMovie = fetchResults[randomIndex];

                    const banner = document.getElementById('banner');
                    const play = document.getElementById('play-button');
                    const info = document.getElementById('more-info');
                    const title = document.getElementById('banner-title');

                    banner.src = `https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`;
                    title.textContent = randomMovie.title || randomMovie.name;

                    function redirectToMovieDetails() {
                        const media_Type = randomMovie.media_type || mediaType;
                        window.location.href = `movie_details/movie_details.html?media=${media_Type}&id=${randomMovie.id}`;
                    }

                    play.addEventListener('click', redirectToMovieDetails);
                    info.addEventListener('click', redirectToMovieDetails);
                }
            })
            .catch(error => {
                console.error(error);

            });
    })
}


fetchMedia('trending-container', 'trending/all/week?');
fetchMedia('netflix-container', 'discover/tv?with_networks=213', 'tv');
fetchMedia('netflixShows-container', 'discover/tv?', 'tv');
fetchMedia('top-container', 'movie/top_rated?', 'movie');
fetchMedia('horror-container', 'discover/movie?with_genres=27', 'movie');
fetchMedia('comedy-container', 'discover/movie?with_genres=35', 'movie');
fetchMedia('action-container', 'discover/movie?with_genres=28', 'movie');
fetchMedia('romantic-container', 'discover/movie?with_genres=10749', 'movie');


const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];


async function handleSearchInput() {
    const query = searchInput.value;
    if (query.length > 2) {
        const results = await fetchSearchResults(query);
        if (results.length !== 0) {
            searchResults.style.visibility = "visible";
        }
        displaySearchResults(results);
    } else {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
}

searchInput.addEventListener('input', handleSearchInput);

searchInput.addEventListener('keyup', async event => {
    if (event.key === 'Enter') {
        handleSearchInput();
    }
});

async function fetchSearchResults(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${api_Key}&query=${query}`);
    const data = await response.json();
    return data.results || [];
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    results.map(movie => {
        const shortenedTitle = movie.title || movie.name;
        const date = movie.release_date || movie.first_air_date;

        let buttonText = "Add to WatchList"; 

        if (watchlist.find(watchlistItem => watchlistItem.id === movie.id)) {
            buttonText = "Go to WatchList"; 
        }

        const movieItem = document.createElement('div');
        
        movieItem.innerHTML = `<div class = "search-item-thumbnail">
                                    <img src ="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                                </div>
                                <div class ="search-item-info">
                                    <h3>${shortenedTitle}</h3>
                                    <p>${movie.media_type} <span> &nbsp; ${date}</span></p>
                                </div>
                                <button class="watchListBtn" id="${movie.id}">${buttonText}</button>`;

        const watchListBtn = movieItem.querySelector('.watchListBtn');

        
        watchListBtn.addEventListener('click', () => {
            if (buttonText === "Add to WatchList") {
                addToWatchList(movie);
            } else {
                window.location.href = 'watchList/watchlist.html';
            }
        });

        const thumbnail = movieItem.querySelector('.search-item-thumbnail');
        const info = movieItem.querySelector('.search-item-info');

        
        (thumbnail && info).addEventListener('click', () => {
            window.location.href = `movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
        });

        movieItem.setAttribute('class', 'movie-list');

        
        searchResults.appendChild(movieItem);
    });
}

function addToWatchList(movie) {
    
    if (!watchlist.find(watchlistItem => watchlistItem.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist)); 
        const watchListBtn = document.querySelector(`[id="${movie.id}"]`);
        if (watchListBtn) {
            watchListBtn.textContent = "Go to WatchList";
            watchListBtn.addEventListener('click', () => {
                window.location.href = 'watchList/watchlist.html'; 
            });
        }
    }
}


document.addEventListener('click', event => {
    if (!searchResults.contains(event.target)) {
        searchResults.innerHTML = '';
        searchResults.style.visibility = "hidden";
    }
});


