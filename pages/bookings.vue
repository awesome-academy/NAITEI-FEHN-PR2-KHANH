<template>
  <div class="bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Vé đã đặt</h1>
        <p class="text-gray-400">Quản lý và theo dõi các vé bạn đã đặt</p>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-400">Đang tải danh sách vé...</p>
      </div>

      <div v-else-if="!bookings || bookings.length === 0" class="text-center py-16">
        <UIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Chưa có vé nào</h3>
        <p class="text-gray-400 mb-6">Bạn chưa đặt vé nào. Hãy khám phá các bộ phim đang chiếu!</p>
        <NuxtLink
          to="/movies"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Đặt vé ngay
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-bold text-white mb-1">{{ booking.movieTitle }}</h3>
                  <p class="text-gray-400">{{ booking.cinemaName }}</p>
                </div>
                <div class="text-right">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      booking.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    ]"
                  >
                    {{ getBookingStatusText(booking.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="flex items-center space-x-2 text-gray-300">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  <span>{{ formatDate(booking.date) }}</span>
                </div>
                <div class="flex items-center space-x-2 text-gray-300">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                  <span>{{ booking.time }}</span>
                </div>
                <div class="flex items-center space-x-2 text-gray-300">
                  <UIcon name="i-heroicons-film" class="w-4 h-4" />
                  <span>{{ booking.format }}</span>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-4 mb-4">
                <div class="flex items-center space-x-2 text-gray-300">
                  <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
                  <span>Ghế: {{ booking.seats.join(', ') }}</span>
                </div>
                <div class="flex items-center space-x-2 text-gray-300">
                  <UIcon name="i-heroicons-ticket" class="w-4 h-4" />
                  <span>{{ booking.seats.length }} vé</span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-400">
                  Đặt lúc: {{ formatDateTime(booking.bookingDate) }}
                </div>
                <div class="text-xl font-bold text-red-400">
                  {{ formatCurrency(booking.totalAmount) }}
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 lg:ml-6">
              <button
                class="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
                @click="viewBookingDetails(booking)"
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showDetailsModal && selectedBooking" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-xl max-w-md w-full p-6" @click.stop>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Chi tiết vé</h3>
            <button
              class="text-gray-400 hover:text-white transition-colors"
              @click="showDetailsModal = false"
            >
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm text-gray-400">Mã đặt vé</label>
              <p class="text-white font-mono">{{ selectedBooking.id }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-400">Phim</label>
              <p class="text-white">{{ selectedBooking.movieTitle }}</p>
            </div>

            <div>
              <label class="text-sm text-gray-400">Rạp chiếu</label>
              <p class="text-white">{{ selectedBooking.cinemaName }}</p>
            </div>

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
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                ]"
              >
                {{ getBookingStatusText(selectedBooking.status) }}
              </span>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-700">
            <button
              class="w-full bg-gray-700 text-gray-300 hover:bg-gray-600 font-semibold py-3 px-4 rounded-lg transition-colors"
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
import { ref } from 'vue'
import { useHead, useLazyAsyncData, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useBooking } from '~/composables/useBooking'
import { getBookingStatusText, formatDate, formatDateTime, formatCurrency } from '~/utils/formatters'
import type { Booking } from '~/interfaces/booking'

useHead({
  title: 'Vé đã đặt - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Quản lý và theo dõi các vé bạn đã đặt tại CinemaX'
    }
  ]
})

const { currentUser, isAuthenticated } = useAuth()
const { getUserBookings } = useBooking()

const showDetailsModal = ref<boolean>(false)
const selectedBooking = ref<Booking | null>(null)

const isAuth = ref(isAuthenticated.value)

const { data: bookings, pending } = await useLazyAsyncData(
  'user-bookings',
  async (): Promise<Booking[]> => {
    if (!currentUser.value?.id) return []
    return await getUserBookings(currentUser.value.id)
  },
  {
    default: (): Booking[] => []
  }
)

if (!isAuth.value) {
  await navigateTo('/login')
}


const viewBookingDetails = (booking: Booking): void => {
  selectedBooking.value = booking
  showDetailsModal.value = true
}
</script>
