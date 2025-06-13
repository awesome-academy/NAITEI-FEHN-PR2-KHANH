<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:cursor-pointer transition-all duration-300 hover:scale-105 group">
    <div class="relative overflow-hidden">
      <NuxtImg
        :src="movie.poster"
        :alt="movie.title"
        class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />

      <div class="absolute top-3 left-3">
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-semibold',
            movie.status === 'now-showing' ? 'bg-green-500 text-white' :
            movie.status === 'coming-soon' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          ]">
          {{ getStatusText(movie.status) }}
        </span>
      </div>

      <div class="absolute top-3 right-3 bg-black/70 rounded-full px-2 py-1 flex items-center space-x-1">
        <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
        <span class="text-white text-sm font-semibold">{{ movie.rating }}</span>
      </div>

      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"/>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold text-white mb-2 line-clamp-1">
        {{ movie.title }}
      </h3>

      <p class="text-gray-400 text-sm mb-3 line-clamp-2">
        {{ movie.description }}
      </p>

      <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          <span>{{ movie.duration }} phút</span>
        </div>
        <div class="flex items-center space-x-2">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
          <span>{{ formatDate(movie.releaseDate) }}</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mb-4">
        <span
          v-for="genre in movie.genre.slice(0, 2)"
          :key="genre"
          class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
        >
          {{ genre }}
        </span>
      </div>

      <button class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors">
        {{ movie.status === 'now-showing' ? 'Đặt vé' : 'Xem chi tiết' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStatusText , formatDate} from '~/constants/common';
import type { Movie } from '~/interfaces/movie'

interface Props {
  movie: Movie
}

defineProps<Props>()
</script>
