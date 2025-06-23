<template>
  <div class="bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Quản lý đặt vé</h1>
          <p class="text-gray-400">Theo dõi và quản lý tất cả vé đã đặt trong hệ thống</p>
        </div>

        <div class="flex space-x-4">
          <div class="bg-gray-800 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-400">{{ confirmedCount }}</div>
            <div class="text-sm text-gray-400">Đã xác nhận</div>
          </div>
          <div class="bg-gray-800 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ formatCurrency(totalRevenue) }}</div>
            <div class="text-sm text-gray-400">Doanh thu</div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm theo tên, email, phim..."
              class="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
            <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <input
            v-model="selectedDate"
            type="date"
            class="bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >

          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            @click="clearFilters"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-400">Đang tải danh sách đặt vé...</p>
      </div>

      <div v-else-if="filteredBookings.length > 0" class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Mã đặt vé</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Khách hàng</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rạp</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Suất chiếu</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ghế</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tổng tiền</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="booking in paginatedBookings"
                :key="booking.id"
                class="hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="text-white font-mono text-sm">{{ booking.id }}</div>
                  <div class="text-gray-400 text-xs">{{ formatDateTime(booking.bookingDate) }}</div>
                </td>

                <td class="px-6 py-4">
                  <div v-if="getUserInfo(booking.userId)" class="flex items-center space-x-3">
                    <img
                      :src="getUserInfo(booking.userId)?.avatar"
                      :alt="getUserInfo(booking.userId)?.fullName"
                      class="w-8 h-8 rounded-full"
                    >
                    <div>
                      <div class="text-white font-medium">{{ getUserInfo(booking.userId)?.fullName }}</div>
                      <div class="text-gray-400 text-sm">{{ getUserInfo(booking.userId)?.email }}</div>
                    </div>
                  </div>
                  <div v-else class="text-gray-400">Không tìm thấy</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-white font-medium">{{ booking.movieTitle }}</div>
                  <div class="text-gray-400 text-sm">{{ booking.format }}</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-white">{{ booking.cinemaName }}</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-white">{{ formatDate(booking.date) }}</div>
                  <div class="text-gray-400 text-sm">{{ booking.time }}</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-white">{{ booking.seats.join(', ') }}</div>
                  <div class="text-gray-400 text-sm">{{ booking.seats.length }} ghế</div>
                </td>

                <td class="px-6 py-4">
                  <div class="text-red-400 font-semibold">
                    {{ formatCurrency(booking.totalAmount) }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex space-x-2">
                    <button
                      class="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Xem chi tiết"
                      @click="viewBookingDetails(booking)"
                    >
                      <UIcon name="i-heroicons-eye" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gray-700 px-6 py-4 flex items-center justify-between">
          <div class="text-gray-400 text-sm">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }}
            trong tổng số {{ filteredBookings.length }} kết quả
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
        <UIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Không có đặt vé nào</h3>
        <p class="text-gray-400">Không tìm thấy đặt vé nào phù hợp với bộ lọc</p>
      </div>

      <div v-if="showDetailsModal && selectedBooking" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-2xl w-full p-6" @click.stop>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Chi tiết đặt vé</h3>
            <button
              class="text-gray-400 hover:text-white transition-colors"
              @click="showDetailsModal = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-400">Mã đặt vé</label>
                <p class="text-white font-mono">{{ selectedBooking.id }}</p>
              </div>

              <div>
                <label class="text-sm text-gray-400">Khách hàng</label>
                <div v-if="getUserInfo(selectedBooking.userId)" class="flex items-center space-x-3 mt-1">
                  <img
                    :src="getUserInfo(selectedBooking.userId)?.avatar"
                    :alt="getUserInfo(selectedBooking.userId)?.fullName"
                    class="w-10 h-10 rounded-full"
                  >
                  <div>
                    <p class="text-white font-medium">{{ getUserInfo(selectedBooking.userId)?.fullName }}</p>
                    <p class="text-gray-400 text-sm">{{ getUserInfo(selectedBooking.userId)?.email }}</p>
                    <p class="text-gray-400 text-sm">{{ getUserInfo(selectedBooking.userId)?.phoneNumber }}</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-sm text-gray-400">Phim</label>
                <p class="text-white">{{ selectedBooking.movieTitle }}</p>
              </div>

              <div>
                <label class="text-sm text-gray-400">Rạp chiếu</label>
                <p class="text-white">{{ selectedBooking.cinemaName }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-400">Ngày chiếu</label>
                  <p class="text-white">{{ formatDate(selectedBooking.date) }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-400">Giờ chiếu</label>
                  <p class="text-white">{{ selectedBooking.time }}</p>
                </div>
              </div>

              <div>
                <label class="text-sm text-gray-400">Định dạng</label>
                <p class="text-white">{{ selectedBooking.format }}</p>
              </div>

              <div>
                <label class="text-sm text-gray-400">Ghế ngồi</label>
                <p class="text-white">{{ selectedBooking.seats.join(', ') }}</p>
              </div>

              <div>
                <label class="text-sm text-gray-400">Tổng tiền</label>
                <p class="text-xl font-bold text-red-400">{{ formatCurrency(selectedBooking.totalAmount) }}</p>
              </div>

              <div>
                <label class="text-sm text-gray-400 mr-3">Trạng thái</label>
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1',
                    selectedBooking.status === 'confirmed'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  ]"
                >
                  {{ getBookingStatusText(selectedBooking.status) }}
                </span>
              </div>

              <div>
                <label class="text-sm text-gray-400">Thời gian đặt</label>
                <p class="text-white">{{ formatDateTime(selectedBooking.bookingDate) }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-700 flex space-x-3">
            <button
              class="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="showDetailsModal = false"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead, useLazyAsyncData, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { getBookingStatusText, formatDate, formatDateTime, formatCurrency } from '~/utils/formatters'
import type { Booking } from '~/interfaces/booking'
import type { User } from '~/interfaces/user'
import axios from 'axios'
import { baseURL } from '~/composables/useMovies'

const { currentUser, isAuthenticated } = useAuth()

useHead({
  title: 'Quản lý đặt vé - Admin - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Quản lý và theo dõi tất cả vé đã đặt trong hệ thống CinemaX'
    }
  ]
})

if (!isAuthenticated.value || currentUser.value?.role !== 'admin') {
  await navigateTo('/')
}

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('')
const selectedDate = ref<string>('')
const showDetailsModal = ref<boolean>(false)
const selectedBooking = ref<Booking | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = 10

const { data: bookings, pending } = await useLazyAsyncData(
  'admin-bookings',
  async (): Promise<Booking[]> => {
    try {
      const response = await axios.get<Booking[]>(`${baseURL}/bookings`)
      return response.data.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  },
  {
    default: (): Booking[] => []
  }
)

const { data: users } = await useLazyAsyncData(
  'admin-users',
  async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(`${baseURL}/users`)
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  },
  {
    default: (): User[] => []
  }
)

const filteredBookings = computed<Booking[]>(() => {
  if (!bookings.value) return []

  let filtered = [...bookings.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(booking => {
      const user = getUserInfo(booking.userId)
      return (
        booking.movieTitle.toLowerCase().includes(query) ||
        booking.cinemaName.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query) ||
        user?.fullName.toLowerCase().includes(query) ||
        user?.email.toLowerCase().includes(query)
      )
    })
  }

  if (selectedDate.value) {
    filtered = filtered.filter(booking => booking.date === selectedDate.value)
  }

  return filtered
})

const paginatedBookings = computed<Booking[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBookings.value.slice(start, end)
})

const totalPages = computed<number>(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage)
})

const confirmedCount = computed<number>(() => {
  return filteredBookings.value?.filter(b => b.status === 'confirmed').length || 0
})

const totalRevenue = computed<number>(() => {
  return filteredBookings.value?.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0) || 0
})

const getUserInfo = (userId: string): User | undefined => {
  return users.value?.find(user => user.id === userId)
}

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedDate.value = ''
  currentPage.value = 1
}

const viewBookingDetails = (booking: Booking): void => {
  selectedBooking.value = booking
  showDetailsModal.value = true
}
</script>
