<template lang="html">
  <div class="card">
    <img class="card-img-top" :src="movie.Poster" :alt="movie.Title">
    <div class="card-body">
      <h5 class="card-title">{{movie.Title}}</h5>
      <p class="card-text">{{movie.Year}}</p>
      <button
        v-if="addToWatchLater && !isInWatchLater(movie)"
        @click="addToWatchLater(movie)"
        type="button"
        class="btn btn-success">Watch Later</button>
      <button
        v-if="removeWatchLater"
        @click="removeWatchLater(movie)"
        type="button"
        class="btn btn-danger">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['movie', 'addToWatchLater', 'isInWatchLater', 'removeWatchLater'],
};
</script>
