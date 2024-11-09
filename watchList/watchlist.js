const logo = document.querySelector('.logo');
const watchListItems = document.getElementById('watchList-Items');


function showWatchListItems() {
    
    const storedWatchList = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (storedWatchList.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "It's lonely here. Add some Movies  or Tv shows to WatchList !";
        watchListItems.appendChild(emptyMessage);
    } else {
        storedWatchList.forEach(movie => {
            const shortenedTitle = movie.title || movie.name;
            const date = movie.release_date || movie.first_air_date;
            const watchList_Item = document.createElement('div');
            watchList_Item.classList.add('watchlist-item');
            watchList_Item.innerHTML = `<div class="search-item-thumbnail">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                </div>
                <div class="search-item-info">
                    <h3>${shortenedTitle}</h3>
                    <h4>Year : ${date}</h4>
                </div>
                <button class="removeBtn" id="${movie.id}">Remove From WatchList</button>`;
            watchListItems.appendChild(watchList_Item);

        
            const removeBtn = watchList_Item.querySelector('.removeBtn');
            removeBtn.addEventListener('click', () => removeMovieFromWatchList(movie.id));

            
            const thumbnail = watchList_Item.querySelector('.search-item-thumbnail');
            thumbnail.addEventListener('click', () => {
                
                const movieDetailsURL = `../movie_details/movie_details.html?media=${movie.media_type}&id=${movie.id}`;
                window.location.href = movieDetailsURL;
            });
        });
    }
}


function removeMovieFromWatchList(movieId) {
    let storedWatchList = JSON.parse(localStorage.getItem('watchlist')) || [];

    
    const movieIndex = storedWatchList.findIndex(movie => movie.id === movieId);

    if (movieIndex !== -1) {
        storedWatchList.splice(movieIndex, 1);

        
        localStorage.setItem('watchlist', JSON.stringify(storedWatchList));

        
        const movieElement = document.getElementById(movieId);
        if (movieElement) {
            movieElement.parentElement.remove(); 
        }

    
        if (storedWatchList.length === 0) {
            watchListItems.innerHTML = "";
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = "It's lonely here. Add some Movies  or Tv shows to WatchList!";
            watchListItems.appendChild(emptyMessage);
        }
    }
}


window.addEventListener('load', () => {
    showWatchListItems();
});

logo.addEventListener('click', () => {
    window.location.href = '../index.html';
});



