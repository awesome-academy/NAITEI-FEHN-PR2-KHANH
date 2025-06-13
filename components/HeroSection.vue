<template>
  <section class="relative h-[600px] overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"/>

    <div class="absolute inset-0">
      <NuxtImg
        :src="currentMovie?.backdrop || currentMovie?.poster"
        :alt="currentMovie?.title"
        class="w-full h-full object-cover"
        loading="eager"
      />
    </div>

    <div class="relative z-20 container mx-auto px-4 h-full flex items-center">
      <div class="max-w-2xl">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-white">
          {{ currentMovie?.title }}
        </h1>
        <p class="text-xl text-gray-200 mb-6 line-clamp-3">
          {{ currentMovie?.description }}
        </p>

        <div class="flex items-center space-x-6 mb-8">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-yellow-400" />
            <span class="text-white font-semibold">{{ currentMovie?.rating }}/10</span>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-gray-300" />
            <span class="text-gray-300">{{ currentMovie?.duration }} phút</span>
          </div>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-gray-300" />
            <span class="text-gray-300">{{ formatDate(currentMovie?.releaseDate) }}</span>
          </div>
        </div>

        <div class="flex space-x-4">
          <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2">
            <UIcon name="i-heroicons-play" class="w-5 h-5" />
            <span>Đặt vé ngay</span>
          </button>
          <button class="border border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2">
            <UIcon name="i-heroicons-play-circle" class="w-5 h-5" />
            <span>Xem trailer</span>
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div class="flex space-x-2">
        <button
          v-for="(movie, index) in featuredMovies"
          :key="movie.id"
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            currentIndex === index ? 'bg-red-500' : 'bg-white/50 hover:bg-white/70'
          ]"
          @click="currentIndex = index"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Movie } from '~/interfaces/movie'
import { formatDate } from '~/constants/common';
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  featuredMovies: Movie[]
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const currentMovie = computed(() => props.featuredMovies[currentIndex.value])

let interval: NodeJS.Timeout
onMounted(() => {
  if (props.featuredMovies.length > 1) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.featuredMovies.length
    }, 3000)
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
