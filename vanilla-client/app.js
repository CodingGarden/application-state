const app = document.querySelector('#app');
const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const resultsSection = document.querySelector('#results');
const watchLaterSection = document.querySelector('#watch-later');

const API_URL = 'https://omdb-api.now.sh/?type=movie&s=';

let state = {
  searchTerm: '',
  results: [],
  watchLater: [],
  error: '',
};

render(state);

function setState(newStateValues) {
  state = {...state, ...newStateValues};
  render(state);
}

input.addEventListener('keyup', () => {
  state.searchTerm = input.value;
});

form.addEventListener('submit', formSubmitted);

async function formSubmitted(event) {
  event.preventDefault();
  try {
    const results = await getResults(state.searchTerm);
    setState({
      results,
      error: ''
    });
  } catch(error) {
    setState({
      results: [],
      error: error.message
    });
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

function buttonClicked(event) {
    const { id } = event.target.dataset;
    const movie = state.results.find(movie => movie.imdbID === id);
    setState({
      watchLater: [...state.watchLater, movie]
    });
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
        `<button onclick="buttonClicked(event)" data-id="${movie.imdbID}" type="button" class="btn btn-danger watch-later-button">Watch Later</button>`
        : ''
      }
    </div>
  </div>
  `;
}

function render(state) {
  app.innerHTML = `
    <section class="row movies-area">
      <section class="mt-2 col-9 row" id="results">
        ${
          !state.error ?
            state.results.reduce((html, movie) => {
              return html + getMovieTemplate(movie, 4);
            }, '')
            :
            `<div class="alert alert-danger col" role="alert">
              ${state.error}
            </div>`
        }
      </section>
      <section class="mt-2 col-3 row">
        <h3>Watch Later</h3>
        <section class="row" id="watch-later">
          ${
            state.watchLater.reduce((html, movie) => {
              return html + getMovieTemplate(movie, 12, false);
            }, '')
          }
        </section>
      </section>
    </section>
  `
}
