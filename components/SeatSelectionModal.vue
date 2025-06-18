<template>
  <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
    <div class="bg-gray-900 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <div>
          <h3 class="text-xl font-bold text-white">Chọn ghế ngồi</h3>
          <p class="text-gray-400 mt-1">
            {{ movieTitle }} - {{ cinemaName }} - {{ date }} {{ time }}
          </p>
        </div>
        <button
          class="text-gray-400 hover:text-white transition-colors"
          @click="$emit('close')"
        >
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>
      </div>

      <div class="flex flex-col lg:flex-row h-[calc(95vh-120px)]">
        <div class="flex-1 p-6 overflow-auto">
          <div v-if="loading" class="flex items-center justify-center h-64">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin" />
          </div>

          <div v-else class="space-y-6">
            <div class="text-center mb-8">
              <div class="bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 h-2 rounded-full mx-auto max-w-md mb-2"/>
              <p class="text-gray-400 text-sm">Màn hình</p>
            </div>

            <div class="space-y-3">
              <div
                v-for="(seats, row) in seatMap"
                :key="row"
                class="flex items-center justify-center gap-2"
              >
                <div class="w-8 text-center text-gray-400 font-semibold">{{ row }}</div>

                <div class="flex gap-1">
                  <button
                    v-for="seatNumber in seats"
                    :key="`${row}${seatNumber}`"
                    :class="getSeatClass(row, seatNumber)"
                    :disabled="isSeatOccupied(row, seatNumber)"
                    :title="`Ghế ${row}${seatNumber}`"
                    @click="toggleSeat(row, seatNumber)"
                  >
                    {{ seatNumber }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-700">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gray-600 rounded border border-gray-500"/>
                <span class="text-gray-400 text-sm">Trống</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-red-500 rounded"/>
                <span class="text-gray-400 text-sm">Đã chọn</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gray-800 rounded border border-gray-600"/>
                <span class="text-gray-400 text-sm">Đã đặt</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:w-80 bg-gray-800 p-6 border-l border-gray-700">
          <h4 class="text-lg font-semibold text-white mb-4">Thông tin đặt vé</h4>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Phim:</span>
              <span class="text-white">{{ movieTitle }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Rạp:</span>
              <span class="text-white">{{ cinemaName }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Suất chiếu:</span>
              <span class="text-white">{{ date }} {{ time }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Định dạng:</span>
              <span class="text-white">{{ formatName }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Giá vé:</span>
              <span class="text-white">{{ formatPrice.toLocaleString('vi-VN') }}đ</span>
            </div>
          </div>

          <div v-if="selectedSeats.length > 0" class="mb-6">
            <h5 class="text-white font-medium mb-3">Ghế đã chọn:</h5>
            <div class="space-y-2">
              <div
                v-for="seat in selectedSeats"
                :key="seat"
                class="flex justify-between items-center bg-gray-700 p-2 rounded"
              >
                <span class="text-white text-sm">Ghế {{ seat }}</span>
                <span class="text-red-400 font-semibold text-sm">
                  {{ formatPrice.toLocaleString('vi-VN') }}đ
                </span>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700 pt-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-white">Tổng cộng:</span>
              <span class="text-xl font-bold text-red-400">
                {{ totalAmount.toLocaleString('vi-VN') }}đ
              </span>
            </div>
            <p class="text-gray-400 text-sm mt-1">{{ selectedSeats.length }} ghế</p>
          </div>

          <div class="space-y-3">
            <button
              :disabled="selectedSeats.length === 0 || isBooking"
              :class="[
                'w-full py-3 px-4 rounded-lg font-semibold transition-colors',
                selectedSeats.length === 0 || isBooking
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              ]"
              @click="confirmBooking"
            >
              <span v-if="isBooking" class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
                Đang đặt vé...
              </span>
              <span v-else>
                Xác nhận đặt vé
              </span>
            </button>

            <button
              class="w-full py-3 px-4 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              @click="$emit('close')"
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
import { ref, computed, onMounted, defineEmits } from 'vue'
import { useNuxtApp } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useBooking } from '~/composables/useBooking'
import { SEAT_MAP } from '~/constants/seatmap'
import type { Booking } from '~/interfaces/booking'
import type { Cinema, ShowtimeFormat } from '~/interfaces/cinema'

interface Props {
  movieId: string
  movieTitle: string
  cinema: Cinema
  date: string
  time: string
  format: ShowtimeFormat
  showtimeId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: [booking: Booking]
}>()

const toast = useNuxtApp().$toast
const { currentUser } = useAuth()
const { getBookingsByShowtime, createBooking } = useBooking()

const loading = ref<boolean>(true)
const isBooking = ref<boolean>(false)
const selectedSeats = ref<string[]>([])
const occupiedSeats = ref<string[]>([])

const seatMap = computed(() => SEAT_MAP.rows)
const cinemaName = computed(() => props.cinema.name)
const formatName = computed(() => props.format.name)
const formatPrice = computed(() => props.format.price)
const totalAmount = computed(() => selectedSeats.value.length * formatPrice.value)

const loadOccupiedSeats = async (): Promise<void> => {
  try {
    loading.value = true

    const bookings = await getBookingsByShowtime(props.showtimeId)
    const occupied: string[] = []

    bookings.forEach(booking => {
      if (booking.status === 'confirmed' &&
          booking.time === props.time &&
          booking.date === props.date) {
        occupied.push(...booking.seats)
      }
    })

    occupiedSeats.value = occupied

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Không thể tải thông tin ghế')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOccupiedSeats()
})

const getSeatClass = (row: string, seatNumber: number): string => {
  const seatId = `${row}${seatNumber}`
  const baseClass = 'w-8 h-8 text-xs font-semibold rounded transition-colors border'

  if (occupiedSeats.value.includes(seatId)) {
    return `${baseClass} bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed`
  }

  if (selectedSeats.value.includes(seatId)) {
    return `${baseClass} bg-red-500 text-white border-red-400`
  }

  return `${baseClass} bg-gray-600 text-white border-gray-500 hover:bg-gray-500`
}

const isSeatOccupied = (row: string, seatNumber: number): boolean => {
  const seatId = `${row}${seatNumber}`
  return occupiedSeats.value.includes(seatId)
}

const toggleSeat = (row: string, seatNumber: number): void => {
  const seatId = `${row}${seatNumber}`

  if (occupiedSeats.value.includes(seatId)) {
    return
  }

  const index = selectedSeats.value.indexOf(seatId)

  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    if (selectedSeats.value.length >= 8) {
      toast.warning('Bạn chỉ có thể chọn tối đa 8 ghế')
      return
    }

    selectedSeats.value.push(seatId)
  }
}

const confirmBooking = async (): Promise<void> => {
  if (!currentUser.value || selectedSeats.value.length === 0) {
    return
  }

  isBooking.value = true

  try {
    const bookingData = {
      userId: currentUser.value.id,
      movieId: props.movieId,
      cinemaId: props.cinema.id,
      showtimeId: props.showtimeId,
      movieTitle: props.movieTitle,
      cinemaName: props.cinema.name,
      date: props.date,
      time: props.time,
      format: props.format.name,
      seats: [...selectedSeats.value],
      totalAmount: totalAmount.value,
      status: 'confirmed' as const
    }

    const result = await createBooking(bookingData)

    if (result.success && result.booking) {
      emit('success', result.booking)
      emit('close')
    } else {
      toast.error(result.error || 'Đặt vé thất bại')
    }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi đặt vé, vui lòng thử lại sau')
  } finally {
    isBooking.value = false
  }
}
</script>
