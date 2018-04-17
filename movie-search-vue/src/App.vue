<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Movie Search</a>
      </nav>
    </header>
    <main class="container mt-2">
      <form @submit.prevent="getResults">
        <fieldset class="form-group">
          <label for="searchTerm">Search</label>
          <input v-model="searchTerm" type="text" class="form-control" id="searchTerm" placeholder="Enter a movie title.">
        </fieldset>
        <button type="submit" class="btn btn-primary">GO</button>
      </form>
      <section>
        <section class="row movies-area">
          <section class="mt-2 col-9 row" id="results">
            <div v-if="error" class="alert alert-danger col" role="alert">
              {{error}}
            </div>
            <movie
              class="col-4"
              v-for="movie in results"
              :movie="movie"
              :isInWatchLater="isInWatchLater"
              :addToWatchLater="addToWatchLater"></movie>
          </section>
          <section class="mt-2 col-3 row">
            <h3>Watch Later</h3>
            <section class="row" id="watch-later">
              <movie
                class="col-12"
                v-for="movie in watchLater"
                :removeWatchLater="removeWatchLater"
                :movie="movie"></movie>
            </section>
          </section>
        </section>
      </section>
    </main>
  </div>
</template>

<script>
import Movie from '@/components/Movie';

const API_URL = 'https://omdb-api.now.sh/?type=movie&s=';

export default {
  name: 'app',
  components: {
    Movie,
  },
  data: () => ({
    error: '',
    searchTerm: '',
    results: [],
    watchLater: [],
  }),
  methods: {
    async getResults() {
      const url = `${API_URL}${this.searchTerm}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Error) {
        this.results = [];
        this.error = data.Error;
      } else {
        this.results = data.Search;
        this.error = '';
      }
    },
    addToWatchLater(movie) {
      this.watchLater.push(movie);
    },
    removeWatchLater(movie) {
      const index = this.watchLater.indexOf(movie);
      this.watchLater.splice(index, 1);
    },
    isInWatchLater(movie) {
      return this.watchLater.some(wl => wl.imdbID === movie.imdbID);
    },
  },
};
</script>

<style>
.movies-area {
  justify-content: space-around;
  align-items: flex-start;
}
</style>
