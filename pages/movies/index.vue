<template>
  <div class="bg-gray-900 min-h-screen">
    <section class="bg-gray-800 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Tìm kiếm bộ phim mà bạn yêu thích</h1>
          <p class="text-xl text-gray-300">Khám phá bộ sưu tập phim đa dạng tại CinemaX</p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row gap-4 mb-8">
            <div class="flex-1 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm phim theo tên..."
                class="w-full bg-gray-700 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-600 transition-colors"
              >
              <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div class="flex gap-2">
              <button
                v-for="status in statusFilters"
                :key="status.value"
                :class="[
                  'px-4 py-3 rounded-lg font-medium transition-colors',
                  selectedStatus === status.value
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
                @click="selectedStatus = status.value"
              >
                {{ status.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="genre in availableGenres"
              :key="genre"
              :class="[
                'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                selectedGenres.includes(genre)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div class="text-gray-300">
            <span v-if="searchQuery || selectedStatus !== 'all' || selectedGenres.length > 0">
              Tìm thấy {{ filteredMovies.length }} phim
            </span>
            <span v-else>
              Hiển thị {{ filteredMovies.length }} phim
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-400 text-sm">Sắp xếp:</span>
            <select
              v-model="sortBy"
              class="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="title">Tên phim</option>
              <option value="rating">Đánh giá</option>
              <option value="releaseDate">Ngày phát hành</option>
              <option value="duration">Thời lượng</option>
            </select>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div v-else-if="filteredMovies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MovieCard
            v-for="movie in sortedMovies"
            :key="movie.id"
            :movie="movie"
          />
        </div>

        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-film" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">Không tìm thấy phim nào</h3>
          <p class="text-gray-400 mb-6">
            <span v-if="searchQuery">
              Không có phim nào phù hợp với từ khóa "{{ searchQuery }}"
            </span>
            <span v-else>
              Không có phim nào phù hợp với bộ lọc đã chọn
            </span>
          </p>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            @click="clearFilters"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </section>

    <TrailerModal
      v-if="showTrailer && selectedMovie"
      :movie="selectedMovie"
      @close="showTrailer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead, useLazyAsyncData } from '#app'
import { useMovies } from '~/composables/useMovies'
import type { Movie } from '~/interfaces/movie'

useHead({
  title: 'Tất cả phim - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Khám phá bộ sưu tập phim đa dạng tại CinemaX. Tìm kiếm và đặt vé xem phim yêu thích của bạn.'
    }
  ]
})

const { getMovies } = useMovies()

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('all')
const selectedGenres = ref<string[]>([])
const sortBy = ref<string>('title')
const showTrailer = ref<boolean>(false)
const selectedMovie = ref<Movie | null>(null)

const { data: allMovies, pending } = await useLazyAsyncData('all-movies', () => getMovies())

const statusFilters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'now-showing', label: 'Đang chiếu' },
  { value: 'coming-soon', label: 'Sắp chiếu' },
  { value: 'ended', label: 'Đã kết thúc' }
]

const availableGenres = computed<string[]>(() => {
  if (!allMovies.value) return []

  const genres = new Set<string>()
  allMovies.value.forEach(movie => {
    movie.genre.forEach(g => genres.add(g))
  })

  return Array.from(genres).sort()
})

const filteredMovies = computed<Movie[]>(() => {
  if (!allMovies.value) return []

  let filtered = [...allMovies.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.originalTitle?.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(movie => movie.status === selectedStatus.value)
  }

  if (selectedGenres.value.length > 0) {
    filtered = filtered.filter(movie =>
      selectedGenres.value.some(genre => movie.genre.includes(genre))
    )
  }

  return filtered
})

const sortedMovies = computed<Movie[]>(() => {
  const movies = [...filteredMovies.value]

  switch (sortBy.value) {
    case 'title':
      return movies.sort((a, b) => a.title.localeCompare(b.title))
    case 'rating':
      return movies.sort((a, b) => b.rating - a.rating)
    case 'releaseDate':
      return movies.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    case 'duration':
      return movies.sort((a, b) => b.duration - a.duration)
    default:
      return movies
  }
})

const toggleGenre = (genre: string): void => {
  const index = selectedGenres.value.indexOf(genre)
  if (index > -1) {
    selectedGenres.value.splice(index, 1)
  } else {
    selectedGenres.value.push(genre)
  }
}

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedGenres.value = []
  sortBy.value = 'title'
}
</script>
