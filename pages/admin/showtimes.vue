<template>
  <div class="bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Quản lý lịch chiếu</h1>
          <p class="text-gray-400">Thêm, sửa, xóa và quản lý lịch chiếu cho các phim</p>
        </div>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          @click="openCreateModal"
        >
          <UIcon name="i-heroicons-plus" class="w-5 h-5" />
          <span>Thêm lịch chiếu</span>
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Tìm theo tên phim, rạp..."
              class="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
            <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <input
            v-model="filters.date"
            type="date"
            class="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
          <select
            v-model="filters.cinemaId"
            class="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tất cả rạp</option>
            <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">
              {{ cinema.name }}
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
        <p class="text-gray-400">Đang tải danh sách lịch chiếu...</p>
      </div>

      <div v-else-if="filteredShowtimes.length > 0" class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rạp chiếu</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ngày chiếu</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Định dạng</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Giờ chiếu</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="showtime in paginatedShowtimes"
                :key="showtime.id"
                class="hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div v-if="getMovieInfo(showtime.movieId)">
                    <div class="text-white font-medium">{{ getMovieInfo(showtime.movieId)?.title }}</div>
                    <div class="text-gray-400 text-sm">{{ getMovieInfo(showtime.movieId)?.duration }} phút</div>
                  </div>
                  <div v-else class="text-gray-400">Không tìm thấy phim</div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="getCinemaInfo(showtime.cinemaId)">
                    <div class="text-white font-medium">{{ getCinemaInfo(showtime.cinemaId)?.name }}</div>
                    <div class="text-gray-400 text-sm">{{ getCinemaInfo(showtime.cinemaId)?.address }}</div>
                  </div>
                  <div v-else class="text-gray-400">Không tìm thấy rạp</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-white">{{ formatDate(showtime.date) }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {{ showtime.format.type }}
                    </span>
                    <span class="text-white text-sm">{{ showtime.format.name }}</span>
                  </div>
                  <div class="text-red-400 text-sm font-semibold mt-1">
                    {{ formatCurrency(showtime.format.price) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="time in showtime.times.slice(0, PAGINATION_CONFIG.MAX_VISIBLE_TIMES)"
                      :key="time"
                      class="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                    >
                      {{ time }}
                    </span>
                    <span
                      v-if="showtime.times.length > PAGINATION_CONFIG.MAX_VISIBLE_TIMES"
                      class="px-2 py-1 bg-gray-500 text-gray-400 text-xs rounded"
                    >
                      +{{ showtime.times.length - PAGINATION_CONFIG.MAX_VISIBLE_TIMES }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button
                      class="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Chỉnh sửa"
                      @click="openEditModal(showtime)"
                    >
                      <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
                    </button>
                    <button
                      class="text-red-400 hover:text-red-300 transition-colors"
                      title="Xóa"
                      @click="confirmDelete(showtime)"
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
            Hiển thị {{ paginationInfo.start }} - {{ paginationInfo.end }}
            trong tổng số {{ filteredShowtimes.length }} kết quả
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="pagination.currentPage === 1"
              class="px-3 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="pagination.currentPage = Math.max(1, pagination.currentPage - 1)"
            >
              Trước
            </button>
            <span class="px-3 py-2 bg-red-500 text-white rounded">
              {{ pagination.currentPage }}
            </span>
            <button
              :disabled="pagination.currentPage === totalPages"
              class="px-3 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="pagination.currentPage = Math.min(totalPages, pagination.currentPage + 1)"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-calendar" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Không có lịch chiếu nào</h3>
        <p class="text-gray-400">Không tìm thấy lịch chiếu nào phù hợp với bộ lọc</p>
      </div>

      <div v-if="modal.show" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" @click.stop>
          <div class="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 class="text-xl font-bold text-white">
              {{ modal.isEditing ? 'Chỉnh sửa lịch chiếu' : 'Thêm lịch chiếu mới' }}
            </h3>
            <button
              class="text-gray-400 hover:text-white transition-colors"
              @click="closeModal"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </div>

          <form class="p-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Thông tin cơ bản</h4>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Phim *</label>
                  <select
                    v-model="formData.movieId"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn phim</option>
                    <option v-for="movie in movies" :key="movie.id" :value="movie.id">
                      {{ movie.title }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Rạp chiếu *</label>
                  <select
                    v-model="formData.cinemaId"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn rạp</option>
                    <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">
                      {{ cinema.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Ngày chiếu *</label>
                  <input
                    v-model="formData.date"
                    type="date"
                    required
                    :min="today"
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Định dạng chiếu *</label>
                  <select
                    v-model="selectedFormatType"
                    required
                    class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    @change="updateFormatInfo"
                  >
                    <option value="">Chọn định dạng</option>
                    <option v-for="format in FORMAT_OPTIONS" :key="format.type" :value="format.type">
                      {{ format.name }} - {{ formatCurrency(format.price) }}
                    </option>
                  </select>
                </div>

                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="flex items-center space-x-2 mb-2">
                    <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-400" />
                    <span class="text-white font-medium">Thông tin ghế ngồi</span>
                  </div>
                  <p class="text-gray-300 text-sm">
                    Tổng số ghế: <span class="font-semibold text-white">{{ TOTAL_SEATS }} ghế</span>
                  </p>
                  <p class="text-gray-400 text-xs mt-1">
                    Số ghế được tính tự động từ sơ đồ ghế chuẩn (8 hàng × 10 ghế)
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Giờ chiếu</h4>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Thêm giờ chiếu</label>
                  <div class="flex space-x-2">
                    <input
                      v-model="newTime"
                      type="time"
                      class="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                    <button
                      type="button"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                      @click="addTime"
                    >
                      <UIcon name="i-heroicons-plus" class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div v-if="formData.times.length > 0">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Danh sách giờ chiếu</label>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(time, index) in formData.times"
                      :key="index"
                      class="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                      <span class="text-white font-mono">{{ time }}</span>
                      <button
                        type="button"
                        class="text-red-400 hover:text-red-300 transition-colors"
                        @click="removeTime(index)"
                      >
                        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <UIcon name="i-heroicons-clock" class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p class="text-gray-400">Chưa có giờ chiếu nào</p>
                  <p class="text-gray-500 text-sm">Thêm ít nhất một giờ chiếu</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Thêm nhanh</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="quickTime in QUICK_TIMES"
                      :key="quickTime"
                      type="button"
                      class="bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 px-3 rounded transition-colors"
                      @click="addQuickTime(quickTime)"
                    >
                      {{ quickTime }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex space-x-4 mt-8 pt-6 border-t border-gray-700">
              <button
                type="submit"
                :disabled="modal.isSubmitting || formData.times.length === 0"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <span v-if="modal.isSubmitting" class="flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                  {{ modal.isEditing ? 'Đang cập nhật...' : 'Đang thêm...' }}
                </span>
                <span v-else>
                  {{ modal.isEditing ? 'Cập nhật lịch chiếu' : 'Thêm lịch chiếu' }}
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

      <div v-if="deleteModal.show" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-md w-full p-6" @click.stop>
          <div class="text-center mb-6">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-white mb-2">Xác nhận xóa lịch chiếu</h3>
            <p class="text-gray-400">
              Bạn có chắc chắn muốn xóa lịch chiếu này? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              :disabled="deleteModal.isDeleting"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              @click="handleDelete"
            >
              <span v-if="deleteModal.isDeleting" class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                Đang xóa...
              </span>
              <span v-else>Xóa lịch chiếu</span>
            </button>
            <button
              class="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              @click="deleteModal.show = false"
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
import { ref, computed, watch, reactive } from 'vue'
import { useHead, useLazyAsyncData, navigateTo, useNuxtApp } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useMovies } from '~/composables/useMovies'
import { useShowtimes } from '~/composables/useShowtimes'
import { formatDate, formatCurrency } from '~/utils/formatters'
import { TOTAL_SEATS } from '~/constants/seatmap'
import { QUICK_TIMES, FORMAT_OPTIONS, PAGINATION_CONFIG } from '~/constants/showtimes'
import type { Movie } from '~/interfaces/movie'
import type { Cinema, Showtime } from '~/interfaces/cinema'

const { currentUser, isAuthenticated } = useAuth()
const { getMovies } = useMovies()
const { getCinemas, createShowtime, updateShowtime, deleteShowtime, getShowtimes } = useShowtimes()
const toast = useNuxtApp().$toast

if (!isAuthenticated.value || currentUser.value?.role !== 'admin') {
  navigateTo('/')
}

const filters = reactive({
  search: '',
  date: '',
  cinemaId: ''
})

const pagination = reactive({
  currentPage: 1
})

const modal = reactive({
  show: false,
  isEditing: false,
  isSubmitting: false,
  editingId: null as string | null
})

const deleteModal = reactive({
  show: false,
  isDeleting: false,
  target: null as Showtime | null
})

const newTime = ref('')
const selectedFormatType = ref('')
const today = new Date().toISOString().split('T')[0]

const createDefaultFormData = () => ({
  movieId: '',
  cinemaId: '',
  date: '',
  times: [] as string[],
  format: FORMAT_OPTIONS[0],
  availableSeats: TOTAL_SEATS,
  totalSeats: TOTAL_SEATS
})

const formData = ref(createDefaultFormData())

const { data: movies } = await useLazyAsyncData('admin-movies', () => getMovies(), {
  default: (): Movie[] => []
})

const { data: cinemas } = await useLazyAsyncData('admin-cinemas', () => getCinemas(), {
  default: (): Cinema[] => []
})

const { data: showtimes, pending, refresh } = await useLazyAsyncData('admin-showtimes', () => getShowtimes(), {
  default: (): Showtime[] => []
})

const filteredShowtimes = computed(() => {
  if (!showtimes.value) return []

  let filtered = [...showtimes.value]

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim()
    filtered = filtered.filter(showtime => {
      const movie = getMovieInfo(showtime.movieId)
      const cinema = getCinemaInfo(showtime.cinemaId)
      return (
        movie?.title.toLowerCase().includes(query) ||
        cinema?.name.toLowerCase().includes(query)
      )
    })
  }

  if (filters.date) {
    filtered = filtered.filter(showtime => showtime.date === filters.date)
  }

  if (filters.cinemaId) {
    filtered = filtered.filter(showtime => showtime.cinemaId === filters.cinemaId)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const totalPages = computed(() => {
  return Math.ceil(filteredShowtimes.value.length / PAGINATION_CONFIG.ITEMS_PER_PAGE)
})

const paginatedShowtimes = computed(() => {
  const start = (pagination.currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE
  const end = start + PAGINATION_CONFIG.ITEMS_PER_PAGE
  return filteredShowtimes.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = (pagination.currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE + 1
  const end = Math.min(pagination.currentPage * PAGINATION_CONFIG.ITEMS_PER_PAGE, filteredShowtimes.value.length)
  return { start, end }
})

watch([() => filters.search, () => filters.date, () => filters.cinemaId], () => {
  pagination.currentPage = 1
})

const getMovieInfo = (movieId: string) => movies.value?.find(movie => movie.id === movieId)
const getCinemaInfo = (cinemaId: string) => cinemas.value?.find(cinema => cinema.id === cinemaId)

const clearFilters = () => {
  Object.assign(filters, { search: '', date: '', cinemaId: '' })
  pagination.currentPage = 1
}

const updateFormatInfo = () => {
  const format = FORMAT_OPTIONS.find(f => f.type === selectedFormatType.value)
  if (format) {
    formData.value.format = { ...format }
  }
}

const addTime = () => {
  if (newTime.value && !formData.value.times.includes(newTime.value)) {
    formData.value.times.push(newTime.value)
    formData.value.times.sort()
    newTime.value = ''
  }
}

const addQuickTime = (time: string) => {
  if (!formData.value.times.includes(time)) {
    formData.value.times.push(time)
    formData.value.times.sort()
  }
}

const removeTime = (index: number) => {
  formData.value.times.splice(index, 1)
}

const openCreateModal = () => {
  Object.assign(modal, { show: true, isEditing: false, editingId: null })
  formData.value = createDefaultFormData()
  selectedFormatType.value = '2D'
}

const openEditModal = (showtime: Showtime) => {
  Object.assign(modal, { show: true, isEditing: true, editingId: showtime.id })
  formData.value = {
    movieId: showtime.movieId,
    cinemaId: showtime.cinemaId,
    date: showtime.date,
    times: [...showtime.times],
    format: { ...showtime.format },
    availableSeats: TOTAL_SEATS,
    totalSeats: TOTAL_SEATS
  }
  selectedFormatType.value = showtime.format.type
}

const closeModal = () => {
  Object.assign(modal, { show: false, isEditing: false, isSubmitting: false, editingId: null })
  formData.value = createDefaultFormData()
  selectedFormatType.value = ''
  newTime.value = ''
}

const handleSubmit = async () => {
  if (formData.value.times.length === 0) {
    toast.error('Vui lòng thêm ít nhất một giờ chiếu')
    return
  }

  modal.isSubmitting = true

  try {
    formData.value.availableSeats = TOTAL_SEATS
    formData.value.totalSeats = TOTAL_SEATS

    const result = modal.isEditing && modal.editingId
      ? await updateShowtime(modal.editingId, formData.value)
      : await createShowtime(formData.value)

    if (result.success) {
      toast.success(modal.isEditing ? 'Cập nhật lịch chiếu thành công!' : 'Thêm lịch chiếu thành công!')
      closeModal()
      await refresh()
    } else {
      toast.error(result.error || 'Có lỗi xảy ra')
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    modal.isSubmitting = false
  }
}

const confirmDelete = (showtime: Showtime) => {
  Object.assign(deleteModal, { show: true, target: showtime })
}

const handleDelete = async () => {
  if (!deleteModal.target) return

  deleteModal.isDeleting = true

  try {
    const result = await deleteShowtime(deleteModal.target.id)

    if (result.success) {
      toast.success('Xóa lịch chiếu thành công!')
      Object.assign(deleteModal, { show: false, target: null })
      await refresh()
    } else {
      toast.error(result.error || 'Xóa lịch chiếu thất bại')
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    deleteModal.isDeleting = false
  }
}

useHead({
  title: 'Quản lý lịch chiếu - Admin - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Quản lý và thêm, sửa, xóa lịch chiếu trong hệ thống CinemaX'
    }
  ]
})
</script>
