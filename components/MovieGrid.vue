<template>
  <section class="py-16 bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-white">{{ title }}</h2>
        <NuxtLink
          v-if="showViewAll"
          to="/movies"
          class="text-red-500 hover:text-red-400 font-semibold flex items-center space-x-2 transition-colors"
        >
          <span>Xem tất cả</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
        >
          <div class="w-full h-80 bg-gray-700"/>
          <div class="p-4">
            <div class="h-4 bg-gray-700 rounded mb-2"/>
            <div class="h-3 bg-gray-700 rounded mb-3"/>
            <div class="h-3 bg-gray-700 rounded mb-4"/>
            <div class="h-8 bg-gray-700 rounded"/>
          </div>
        </div>
      </div>

      <div v-else-if="movies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
        />
      </div>

      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-film" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">Không có phim nào để hiển thị</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Movie } from '~/interfaces/movie'

interface Props {
  title: string
  movies: Movie[]
  loading?: boolean
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showViewAll: true
})
</script>
