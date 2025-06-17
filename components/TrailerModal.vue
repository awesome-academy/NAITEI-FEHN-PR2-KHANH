<template>
  <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" @click="$emit('close')">
    <div class="bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh]" @click.stop>
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-xl font-bold text-white">{{ movie.title }} - Trailer</h3>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="$emit('close')"
        >
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>

      <div class="relative aspect-video bg-black">
        <iframe
          width="100%"
          height="100%"
          :src="movie.trailer || 'https://www.youtube.com/embed/mqqft2x_Aa4'"
          :title="`${movie.title} - Trailer`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>

      <!-- Footer -->
      <div class="p-4 bg-gray-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
              <span class="text-white">{{ movie.rating }}/10</span>
            </div>
            <div class="flex items-center space-x-2">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
              <span class="text-gray-300">{{ movie.duration }} phút</span>
            </div>
          </div>

          <button
            v-if="movie.status === 'now-showing'"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            @click="$emit('close')"
          >
            Đặt vé ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/interfaces/movie'

interface Props {
  movie: Movie
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>
