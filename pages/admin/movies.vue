<template>
  <div class="bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Quản lý phim</h1>
          <p class="text-gray-400">Thêm, sửa, xóa và quản lý tất cả phim trong hệ thống</p>
        </div>

        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          @click="openCreateModal"
        >
          <UIcon name="i-heroicons-plus" class="w-5 h-5" />
          <span>Thêm phim mới</span>
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo tên phim..."
              class="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
            <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <select
            v-model="selectedStatus"
            class="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="now-showing">Đang chiếu</option>
            <option value="coming-soon">Sắp chiếu</option>
            <option value="ended">Đã kết thúc</option>
          </select>

          <select
            v-model="selectedGenre"
            class="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả thể loại</option>
            <option v-for="genre in availableGenres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>

          <button
            class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            @click="clearFilters"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-400">Đang tải danh sách phim...</p>
      </div>

      <div v-else-if="filteredMovies.length > 0" class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thể loại</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Trạng thái</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Đánh giá</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thời lượng</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ngày phát hành</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="movie in paginatedMovies"
                :key="movie.id"
                class="hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-4">
                    <NuxtImg
                      :src="movie.poster"
                      :alt="movie.title"
                      class="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <div class="text-white font-medium">{{ movie.title }}</div>
                      <div v-if="movie.originalTitle && movie.originalTitle !== movie.title" class="text-gray-400 text-sm">
                        {{ movie.originalTitle }}
                      </div>
                      <div class="text-gray-400 text-sm">{{ movie.director }}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="genre in movie.genre.slice(0, 2)"
                      :key="genre"
                      class="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                    >
                      {{ genre }}
                    </span>
                    <span
                      v-if="movie.genre.length > 2"
                      class="px-2 py-1 bg-gray-500 text-gray-400 text-xs rounded"
                    >
                      +{{ movie.genre.length - 2 }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      movie.status === 'now-showing' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      movie.status === 'coming-soon' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    ]"
                  >
                    {{ getStatusText(movie.status) }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center space-x-1">
                    <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                    <span class="text-white">{{ movie.rating }}/10</span>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span class="text-white">{{ movie.duration }} phút</span>
                </td>

                <td class="px-6 py-4">
                  <span class="text-white">{{ formatDate(movie.releaseDate) }}</span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button
                      class="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Chỉnh sửa"
                      @click="openEditModal(movie)"
                    >
                      <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
                    </button>
                    <button
                      class="text-red-400 hover:text-red-300 transition-colors"
                      title="Xóa"
                      @click="confirmDelete(movie)"
                    >
                      <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gray-700 px-6 py-4 flex items-center justify-between">
          <div class="text-gray-400 text-sm">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredMovies.length) }}
            trong tổng số {{ filteredMovies.length }} kết quả
          </div>

          <div class="flex space-x-2">
            <button
              :disabled="currentPage === 1"
              class="px-3 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Trước
            </button>

            <span class="px-3 py-2 bg-red-500 text-white rounded">
              {{ currentPage }}
            </span>

            <button
              :disabled="currentPage === totalPages"
              class="px-3 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-film" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Không có phim nào</h3>
        <p class="text-gray-400">Không tìm thấy phim nào phù hợp với bộ lọc</p>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto" @click.stop>
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 class="text-xl font-bold text-white">
              {{ isEditing ? 'Chỉnh sửa phim' : 'Thêm phim mới' }}
            </h3>
            <button
              class="text-gray-400 hover:text-white transition-colors"
              @click="closeModal"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </div>

          <form class="p-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left Column - Basic Info -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Thông tin cơ bản</h4>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Tên phim *</label>
                  <input
                    v-model="formData.title"
                    type="text"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tên phim"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Tên gốc</label>
                  <input
                    v-model="formData.originalTitle"
                    type="text"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tên gốc"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Đạo diễn *</label>
                  <input
                    v-model="formData.director"
                    type="text"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tên đạo diễn"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Thời lượng (phút) *</label>
                    <input
                      v-model.number="formData.duration"
                      type="number"
                      required
                      min="1"
                      class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Thời lượng"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Đánh giá *</label>
                    <input
                      v-model.number="formData.rating"
                      type="number"
                      required
                      min="0"
                      max="10"
                      step="0.1"
                      class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="0-10"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Ngày phát hành *</label>
                  <input
                    v-model="formData.releaseDate"
                    type="date"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Trạng thái *</label>
                    <select
                      v-model="formData.status"
                      required
                      class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="now-showing">Đang chiếu</option>
                      <option value="coming-soon">Sắp chiếu</option>
                      <option value="ended">Đã kết thúc</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Ngôn ngữ *</label>
                    <input
                      v-model="formData.language"
                      type="text"
                      required
                      class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Ngôn ngữ"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Phân loại tuổi *</label>
                  <select
                    v-model="formData.ageRating"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn phân loại</option>
                    <option value="G">G - Mọi lứa tuổi</option>
                    <option value="PG">PG - Có sự hướng dẫn của phụ huynh</option>
                    <option value="PG-13">PG-13 - Trên 13 tuổi</option>
                    <option value="R">R - Trên 17 tuổi</option>
                    <option value="NC-17">NC-17 - Trên 18 tuổi</option>
                  </select>
                </div>

                <div class="flex items-center space-x-2">
                  <input
                    id="featured"
                    v-model="formData.featured"
                    type="checkbox"
                    class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  >
                  <label for="featured" class="text-sm text-gray-300">Phim nổi bật</label>
                </div>
              </div>

              <!-- Middle Column - Content -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Nội dung</h4>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Mô tả *</label>
                  <textarea
                    v-model="formData.description"
                    required
                    rows="6"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập mô tả phim"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Thể loại *</label>
                  <input
                    v-model="genreInput"
                    type="text"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập thể loại, cách nhau bằng dấu phẩy"
                  >
                  <p class="text-gray-400 text-sm mt-1">Ví dụ: Hành động, Phiêu lưu, Khoa học viễn tưởng</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Diễn viên *</label>
                  <textarea
                    v-model="castInput"
                    required
                    rows="5"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tên diễn viên, mỗi tên một dòng"
                  />
                  <p class="text-gray-400 text-sm mt-1">Mỗi diễn viên một dòng</p>
                </div>
              </div>

              <!-- Right Column - Media -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Hình ảnh & Media</h4>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">URL Poster *</label>
                  <input
                    v-model="formData.poster"
                    type="url"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/poster.jpg"
                  >
                  <div v-if="formData.poster" class="mt-3">
                    <p class="text-gray-400 text-sm mb-2">Xem trước poster:</p>
                    <img
                      :src="formData.poster"
                      alt="Poster preview"
                      class="w-full max-w-48 h-64 object-cover rounded-lg border border-gray-600"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">URL Backdrop *</label>
                  <input
                    v-model="formData.backdrop"
                    type="url"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/backdrop.jpg"
                  >
                  <div v-if="formData.backdrop" class="mt-3">
                    <p class="text-gray-400 text-sm mb-2">Xem trước backdrop:</p>
                    <img
                      :src="formData.backdrop"
                      alt="Backdrop preview"
                      class="w-full h-32 object-cover rounded-lg border border-gray-600"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">URL Trailer</label>
                  <input
                    v-model="formData.trailer"
                    type="url"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://www.youtube.com/embed/..."
                  >
                  <p class="text-gray-400 text-sm mt-1">URL embed YouTube (không bắt buộc)</p>
                </div>
              </div>
            </div>

            <div class="flex space-x-4 mt-8 pt-6 border-t border-gray-700">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                  {{ isEditing ? 'Đang cập nhật...' : 'Đang thêm...' }}
                </span>
                <span v-else>
                  {{ isEditing ? 'Cập nhật phim' : 'Thêm phim' }}
                </span>
              </button>

              <button
                type="button"
                class="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                @click="closeModal"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-md w-full p-6" @click.stop>
          <div class="text-center mb-6">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-white mb-2">Xác nhận xóa phim</h3>
            <p class="text-gray-400">
              Bạn có chắc chắn muốn xóa phim "<span class="text-white font-medium">{{ movieToDelete?.title }}</span>"?
              Hành động này không thể hoàn tác.
            </p>
          </div>

          <div class="flex space-x-3">
            <button
              :disabled="isDeleting"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              @click="handleDelete"
            >
              <span v-if="isDeleting" class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                Đang xóa...
              </span>
              <span v-else>Xóa phim</span>
            </button>
            <button
              class="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              @click="showDeleteModal = false"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead, useLazyAsyncData, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useMovies } from '~/composables/useMovies'
import { getStatusText, formatDate } from '~/constants/common'
import type { Movie } from '~/interfaces/movie'

const { currentUser, isAuthenticated } = useAuth()
const { getMovies, createMovie, updateMovie, deleteMovie } = useMovies()
const toast = useNuxtApp().$toast

useHead({
  title: 'Quản lý phim - Admin - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Quản lý và thêm, sửa, xóa phim trong hệ thống CinemaX'
    }
  ]
})

if (!isAuthenticated.value || currentUser.value?.role !== 'admin') {
  navigateTo('/')
}

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('')
const selectedGenre = ref<string>('')
const currentPage = ref<number>(1)
const itemsPerPage = 6

const showModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const isDeleting = ref<boolean>(false)
const movieToDelete = ref<Movie | null>(null)

const defaultFormData = (): Omit<Movie, 'id'> => ({
  title: '',
  originalTitle: '',
  description: '',
  duration: 0,
  releaseDate: '',
  genre: [],
  director: '',
  cast: [],
  rating: 0,
  poster: '',
  backdrop: '',
  trailer: '',
  status: 'coming-soon',
  language: '',
  ageRating: '',
  featured: false
})

const formData = ref<Omit<Movie, 'id'>>(defaultFormData())
const genreInput = ref<string>('')
const castInput = ref<string>('')
const editingMovieId = ref<string | null>(null)

const { data: movies, pending, refresh } = await useLazyAsyncData(
  'admin-movies',
  () => getMovies(),
  {
    default: (): Movie[] => []
  }
)

const availableGenres = computed<string[]>(() => {
  if (!movies.value) return []

  const genres = new Set<string>()
  movies.value.forEach(movie => {
    movie.genre.forEach(g => genres.add(g))
  })

  return Array.from(genres).sort()
})

const filteredMovies = computed<Movie[]>(() => {
  if (!movies.value) return []

  let filtered = [...movies.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.originalTitle?.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(movie => movie.status === selectedStatus.value)
  }

  if (selectedGenre.value) {
    filtered = filtered.filter(movie => movie.genre.includes(selectedGenre.value))
  }

  return filtered
})

const paginatedMovies = computed<Movie[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMovies.value.slice(start, end)
})

const totalPages = computed<number>(() => {
  return Math.ceil(filteredMovies.value.length / itemsPerPage)
})

watch([searchQuery, selectedStatus, selectedGenre], () => {
  currentPage.value = 1
})

watch(genreInput, (newValue) => {
  formData.value.genre = newValue.split(',').map(g => g.trim()).filter(g => g.length > 0)
})

watch(castInput, (newValue) => {
  formData.value.cast = newValue.split('\n').map(c => c.trim()).filter(c => c.length > 0)
})

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedGenre.value = ''
  currentPage.value = 1
}

const openCreateModal = (): void => {
  isEditing.value = false
  formData.value = defaultFormData()
  genreInput.value = ''
  castInput.value = ''
  editingMovieId.value = null
  showModal.value = true
}

const openEditModal = (movie: Movie): void => {
  isEditing.value = true
  editingMovieId.value = movie.id
  formData.value = {
    title: movie.title,
    originalTitle: movie.originalTitle || '',
    description: movie.description,
    duration: movie.duration,
    releaseDate: movie.releaseDate,
    genre: [...movie.genre],
    director: movie.director,
    cast: [...movie.cast],
    rating: movie.rating,
    poster: movie.poster,
    backdrop: movie.backdrop,
    trailer: movie.trailer || '',
    status: movie.status,
    language: movie.language,
    ageRating: movie.ageRating,
    featured: movie.featured || false
  }
  genreInput.value = movie.genre.join(', ')
  castInput.value = movie.cast.join('\n')
  showModal.value = true
}

const closeModal = (): void => {
  showModal.value = false
  formData.value = defaultFormData()
  genreInput.value = ''
  castInput.value = ''
  editingMovieId.value = null
  isEditing.value = false
}

const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true

  try {
    let result

    if (isEditing.value && editingMovieId.value) {
      result = await updateMovie(editingMovieId.value, formData.value)
    } else {
      result = await createMovie(formData.value)
    }

    if (result.success) {
      toast.success(isEditing.value ? 'Cập nhật phim thành công!' : 'Thêm phim thành công!')
      closeModal()
      await refresh()
    } else {
      toast.error(result.error || 'Có lỗi xảy ra')
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (movie: Movie): void => {
  movieToDelete.value = movie
  showDeleteModal.value = true
}

const handleDelete = async (): Promise<void> => {
  if (!movieToDelete.value) return

  isDeleting.value = true

  try {
    const result = await deleteMovie(movieToDelete.value.id)

    if (result.success) {
      toast.success('Xóa phim thành công!')
      showDeleteModal.value = false
      movieToDelete.value = null
      await refresh()
    } else {
      toast.error(result.error || 'Xóa phim thất bại')
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    isDeleting.value = false
  }
}
</script>
