const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const resultsSection = document.querySelector('#results');
const watchLaterSection = document.querySelector('#watch-later');

const API_URL = 'https://omdb-api.now.sh/?type=movie&s=';

const state = {
  searchTerm: '',
  results: [],
  watchLater: []
};

input.addEventListener('keyup', () => {
  state.searchTerm = input.value;
});

form.addEventListener('submit', formSubmitted);

async function formSubmitted(event) {
  event.preventDefault();
  try {
    state.results = await getResults(state.searchTerm);
    showResults();
  } catch(error) {
    showError(error);
  }
}

async function getResults(searchTerm) {
  const url = `${API_URL}${searchTerm}`;
  const response = await fetch(url);
  const data = await response.json();
  if(data.Error) {
    throw new Error(data.Error);
  }
  return data.Search;
}

function showResults() {
  resultsSection.innerHTML = state.results.reduce((html, movie) => {
    return html + getMovieTemplate(movie, 4);
  }, '');

  addButtonListeners();
}

function addButtonListeners() {
  const watchLaterButtons = document.querySelectorAll('.watch-later-button');
  watchLaterButtons.forEach(button => {
    button.addEventListener('click', buttonClicked);
  });
}

function buttonClicked(event) {
    const { id } = event.target.dataset;
    const movie = state.results.find(movie => movie.imdbID === id);
    state.watchLater.push(movie);
    updateWatchLaterSection();
}

function updateWatchLaterSection() {
  watchLaterSection.innerHTML = state.watchLater.reduce((html, movie) => {
    return html + getMovieTemplate(movie, 12, false);
  }, '');
}

function getMovieTemplate(movie, cols, button = true) {
  return `
  <div class="card col-${cols}">
    <img class="card-img-top" src="${movie.Poster}" alt="${movie.Title}">
    <div class="card-body">
      <h5 class="card-title">${movie.Title}</h5>
      <p class="card-text">${movie.Year}</p>
      ${
        button ?
        `<button data-id="${movie.imdbID}" type="button" class="btn btn-danger watch-later-button">Watch Later</button>`
        : ''
      }
    </div>
  </div>
  `;
}

function showError(error) {
  resultsSection.innerHTML =  `
  <div class="alert alert-danger col" role="alert">
    ${error.message}
  </div>
  `;
}
