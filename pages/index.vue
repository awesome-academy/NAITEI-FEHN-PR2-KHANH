<template>
  <div>
    <HeroSection :featured-movies="featuredMovies" />

    <MovieGrid
      title="Phim đang chiếu"
      :movies="nowShowingMovies"
      :loading="pending"
    />

    <MovieGrid
      title="Phim sắp chiếu"
      :movies="comingSoonMovies"
      :loading="pending"
    />
    <CinemaFeatures />
  </div>
</template>

<script setup lang="ts">
import { useHead, useLazyAsyncData } from '#app'
import { useMovies } from '~/composables/useMovies'
import { computed } from 'vue'

useHead({
  title: 'CinemaX - Hệ thống rạp chiếu phim hiện đại',
  meta: [
    {
      name: 'description',
      content: 'Đặt vé xem phim online tại CinemaX. Hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tốt nhất.'
    }
  ]
})

const { getMovies } = useMovies()
const { data: allMovies, pending } = await useLazyAsyncData('movies', () => getMovies())
const featuredMovies = computed(() => {
  return allMovies.value?.filter(movie => movie.featured) || []
})

const nowShowingMovies = computed(() => {
  return allMovies.value?.filter(movie => movie.status === 'now-showing').slice(0, 8) || []
})

const comingSoonMovies = computed(() => {
  return allMovies.value?.filter(movie => movie.status === 'coming-soon').slice(0, 8) || []
})
</script>
