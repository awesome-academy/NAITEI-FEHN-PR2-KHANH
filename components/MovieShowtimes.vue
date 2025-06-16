<template>
  <div class="bg-gray-900 rounded-xl p-6">
    <div class="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <button
        v-for="date in availableDates"
        :key="date.value"
        :class="[
          'flex-shrink-0 px-4 py-3 rounded-lg text-center min-w-[100px] transition-colors',
          selectedDate === date.value
            ? 'bg-red-500 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
        @click="handleDateChange(date.value)"
      >
        <div class="text-sm font-medium">{{ date.dayName }}</div>
        <div class="text-xs">{{ date.dateStr }}</div>
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-400">Đang tải lịch chiếu...</p>
    </div>

    <div v-else-if="groupedShowtimes.length > 0" class="space-y-6">
      <div
        v-for="cinemaGroup in groupedShowtimes"
        :key="cinemaGroup.cinema.id"
        class="border-b border-gray-700 last:border-b-0 pb-6 last:pb-0"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-building-office" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">{{ cinemaGroup.cinema.name }}</h3>
            <p class="text-sm text-gray-400">{{ cinemaGroup.cinema.address }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="formatGroup in cinemaGroup.formats"
            :key="formatGroup.format.type"
            class="bg-gray-800 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <span class="text-white font-medium">{{ formatGroup.format.name }}</span>
                <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {{ formatGroup.format.type }}
                </span>
              </div>
              <span class="text-red-400 font-semibold">
                {{ formatGroup.format.price.toLocaleString('vi-VN') }}đ
              </span>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <button
                v-for="time in formatGroup.times"
                :key="time"
                :class="[
                  'py-2 px-3 rounded text-sm font-medium transition-colors',
                  isTimeAvailable(time)
                    ? 'bg-gray-700 text-white hover:bg-red-500'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                ]"
                :disabled="!isTimeAvailable(time)"
                @click="selectShowtime(cinemaGroup.cinema, formatGroup.format, time)"
              >
                {{ time }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <UIcon name="i-heroicons-calendar-x" class="w-12 h-12 text-gray-600 mx-auto mb-3" />
      <p class="text-gray-400">Không có lịch chiếu cho ngày đã chọn</p>
    </div>

    <div v-if="showLoginModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div class="bg-gray-900 rounded-xl p-6 max-w-md w-full" @click.stop>
        <div class="text-center mb-6">
          <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">Yêu cầu đăng nhập</h3>
          <p class="text-gray-400">Bạn cần đăng nhập để đặt vé xem phim</p>
        </div>

        <div class="flex space-x-3">
          <NuxtLink
            to="/login"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
          >
            Đăng nhập
          </NuxtLink>
          <button
            class="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            @click="showLoginModal = false"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useShowtimes } from '~/composables/useShowtimes'
import type { Cinema, Showtime, ShowtimeFormat } from '~/interfaces/cinema'

interface Props {
  movieId: string | number
}

interface DateOption {
  value: string
  dayName: string
  dateStr: string
}

interface GroupedShowtime {
  cinema: Cinema
  formats: {
    format: ShowtimeFormat
    times: string[]
  }[]
}

const props = defineProps<Props>()

const toast = useNuxtApp().$toast
const { isAuthenticated } = useAuth()
const { getCinemas, getShowtimesByDate } = useShowtimes()

const availableDates = ref<DateOption[]>([])
const selectedDate = ref<string>('')
const loading = ref<boolean>(false)
const cinemas = ref<Cinema[]>([])
const showtimes = ref<Showtime[]>([])
const showLoginModal = ref<boolean>(false)
const now = ref(new Date())

const generateDates = (): DateOption[] => {
  const dates: DateOption[] = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const dayName = i === 0 ? 'Hôm nay' : dayNames[date.getDay()]

    dates.push({
      value: date.toISOString().split('T')[0],
      dayName,
      dateStr: `${date.getDate()}/${date.getMonth() + 1}`
    })
  }

  return dates
}

const groupedShowtimes = computed<GroupedShowtime[]>(() => {
  const grouped: { [cinemaId: string]: GroupedShowtime } = {}

  showtimes.value.forEach((showtime) => {
    const cinema = cinemas.value.find(c => c.id === showtime.cinemaId)
    if (!cinema) return

    if (!grouped[cinema.id]) {
      grouped[cinema.id] = {
        cinema,
        formats: []
      }
    }

    const existingFormat = grouped[cinema.id].formats.find(
      f => f.format.type === showtime.format.type
    )

    if (existingFormat) {
      existingFormat.times.push(...showtime.times)
    } else {
      grouped[cinema.id].formats.push({
        format: showtime.format,
        times: [...showtime.times]
      })
    }
  })

  return Object.values(grouped)
})

const isTimeAvailable = (time: string): boolean => {
  if (selectedDate.value === availableDates.value[0]?.value) {
    const [hours, minutes] = time.split(':').map(Number)
    const showTime = new Date()
    showTime.setHours(hours, minutes, 0, 0)

    return showTime > now.value
  }
  return true
}

const selectShowtime = (cinema: Cinema, format: ShowtimeFormat, time: string): void => {
  if (!isAuthenticated.value) {
    showLoginModal.value = true
    return
  }

  toast.success(`Đã chọn suất chiếu ${time} - ${format.name} tại ${cinema.name}`)
}

const handleDateChange = async (date: string): Promise<void> => {
  selectedDate.value = date
  await loadShowtimes()
}

const loadShowtimes = async (): Promise<void> => {
  if (!selectedDate.value) return

  loading.value = true
  try {
    showtimes.value = await getShowtimesByDate(props.movieId, selectedDate.value)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Không thể tải lịch chiếu')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  availableDates.value = generateDates()
  selectedDate.value = availableDates.value[0].value

  try {
    cinemas.value = await getCinemas()
    await loadShowtimes()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Không thể tải danh sách rạp chiếu')
  }
})

watch(() => props.movieId, async () => {
  await loadShowtimes()
})
</script>
