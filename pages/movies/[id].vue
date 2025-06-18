<template>
  <div v-if="pending" class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-400">Đang tải thông tin phim...</p>
    </div>
  </div>

  <div v-else-if="!movie" class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-white mb-2">Không tìm thấy phim</h1>
      <p class="text-gray-400 mb-6">Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <NuxtLink to="/movies" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Quay lại danh sách phim
      </NuxtLink>
    </div>
  </div>

  <div v-else class="bg-gray-900 min-h-screen">
    <section class="relative h-[70vh] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"/>

      <div class="absolute inset-0">
        <NuxtImg
          :src="movie.backdrop || movie.poster"
          :alt="movie.title"
          class="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <div class="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          <!-- Poster -->
          <div class="lg:col-span-1">
            <div class="w-full max-w-sm mx-auto">
              <NuxtImg
                :src="movie.poster"
                :alt="movie.title"
                class="w-full rounded-xl shadow-2xl"
                loading="eager"
              />
            </div>
          </div>

          <!-- Movie Info -->
          <div class="lg:col-span-2 flex flex-col justify-center">
            <div class="mb-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  movie.status === 'now-showing' ? 'bg-green-500 text-white' :
                  movie.status === 'coming-soon' ? 'bg-blue-500 text-white' :
                  'bg-gray-500 text-white'
                ]">
                {{ getStatusText(movie.status) }}
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
              {{ movie.title }}
            </h1>

            <p v-if="movie.originalTitle && movie.originalTitle !== movie.title" class="text-xl text-gray-300 mb-4">
              {{ movie.originalTitle }}
            </p>

            <div class="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-yellow-400" />
                <span class="font-semibold">{{ movie.rating }}/10</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                <span>{{ movie.duration }} phút</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                <span>{{ formatDate(movie.releaseDate) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-language" class="w-5 h-5" />
                <span>{{ movie.language }}</span>
              </div>
              <div class="px-2 py-1 bg-gray-700 rounded text-sm">
                {{ movie.ageRating }}
              </div>
            </div>

            <p class="text-lg text-gray-200 mb-6 leading-relaxed">
              {{ movie.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="genre in movie.genre"
                :key="genre"
                class="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm"
              >
                {{ genre }}
              </span>
            </div>

            <div class="flex flex-wrap gap-4">
              <button
                v-if="movie.status === 'now-showing'"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
              >
                <UIcon name="i-heroicons-ticket" class="w-5 h-5" />
                <span>Đặt vé ngay</span>
              </button>

              <button
                class="border border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
                @click="showTrailer = true"
              >
                <UIcon name="i-heroicons-play-circle" class="w-5 h-5" />
                <span>Xem trailer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-white mb-6">Thông tin chi tiết</h2>

            <div class="bg-gray-900 rounded-xl p-6 mb-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-semibold text-white mb-3">Đạo diễn</h3>
                  <p class="text-gray-300">{{ movie.director }}</p>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-white mb-3">Diễn viên</h3>
                  <div class="space-y-1">
                    <p v-for="actor in movie.cast" :key="actor" class="text-gray-300">
                      {{ actor }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="movie.status === 'now-showing'">
              <h2 class="text-2xl font-bold text-white mb-6">Lịch chiếu</h2>
              <MovieShowtimes :movie-id="movie.id" :movie-title="movie.title" />
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-gray-900 rounded-xl p-6 sticky top-8">
              <h3 class="text-xl font-bold text-white mb-6">Thông tin phim</h3>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-400">Thời lượng:</span>
                  <span class="text-white">{{ movie.duration }} phút</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Ngày khởi chiếu:</span>
                  <span class="text-white">{{ formatDate(movie.releaseDate) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Ngôn ngữ:</span>
                  <span class="text-white">{{ movie.language }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Phân loại:</span>
                  <span class="text-white">{{ movie.ageRating }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-400">Đánh giá:</span>
                  <div class="flex items-center space-x-1">
                    <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                    <span class="text-white">{{ movie.rating }}/10</span>
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-gray-700">
                <h4 class="text-lg font-semibold text-white mb-4">Thể loại</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="genre in movie.genre"
                    :key="genre"
                    class="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded"
                  >
                    {{ genre }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <TrailerModal
      v-if="showTrailer"
      :movie="movie"
      @close="showTrailer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useHead, useLazyAsyncData } from '#app'
import { useMovies } from '~/composables/useMovies'
import { getStatusText, formatDate } from '~/constants/common'

const route = useRoute()
const { getMovieById } = useMovies()

const movieId = parseInt(route.params.id as string)
const showTrailer = ref(false)

const { data: movie, pending } = await useLazyAsyncData(
  `movie-${movieId}`,
  () => getMovieById(movieId)
)

useHead(() => ({
  title: movie.value ? `${movie.value.title} - CinemaX` : 'Phim - CinemaX',
  meta: [
    {
      name: 'description',
      content: movie.value?.description || 'Xem thông tin chi tiết phim tại CinemaX'
    }
  ]
}))
</script>
