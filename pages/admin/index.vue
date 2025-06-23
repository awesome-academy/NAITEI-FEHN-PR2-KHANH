<template>
  <div class="bg-gray-900 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
        <p class="text-gray-400">Tổng quan hệ thống CinemaX</p>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
        <p class="text-gray-400">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Tổng phim</p>
                <p class="text-2xl font-bold text-white">{{ stats.totalMovies }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-film" class="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Tổng người dùng</p>
                <p class="text-2xl font-bold text-white">{{ stats.totalUsers }}</p>
              </div>
              <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-users" class="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Vé đã bán</p>
                <p class="text-2xl font-bold text-white">{{ stats.totalBookings }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-400 text-sm">Doanh thu</p>
                <p class="text-2xl font-bold text-white">{{ formatCurrency(stats.totalRevenue) }}</p>
              </div>
              <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <NuxtLink
            to="/admin/bookings"
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Quản lý đặt vé</h3>
                <p class="text-gray-400 text-sm">Xem và quản lý tất cả vé đã đặt</p>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/movies"
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <UIcon name="i-heroicons-film" class="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Quản lý phim</h3>
                <p class="text-gray-400 text-sm">Thêm, sửa, xóa phim trong hệ thống</p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/admin/showtimes"
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Quản lý lịch chiếu</h3>
                <p class="text-gray-400 text-sm">Thêm, sửa lịch chiếu cho phim</p>
              </div>
            </div>
          </NuxtLink>

        </div>

        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Đặt vé gần đây</h2>
            <NuxtLink
              to="/admin/bookings"
              class="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Xem tất cả
            </NuxtLink>
          </div>

          <div v-if="recentBookings.length > 0" class="space-y-4">
            <div
              v-for="booking in recentBookings"
              :key="booking.id"
              class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div v-if="getUserInfo(booking.userId)" class="flex items-center space-x-3">
                  <img
                    :src="getUserInfo(booking.userId)?.avatar"
                    :alt="getUserInfo(booking.userId)?.fullName"
                    class="w-10 h-10 rounded-full"
                  >
                  <div>
                    <p class="text-white font-medium">{{ getUserInfo(booking.userId)?.fullName }}</p>
                    <p class="text-gray-400 text-sm">{{ booking.movieTitle }}</p>
                  </div>
                </div>
                <div v-else class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p class="text-gray-400 font-medium">Người dùng không tồn tại</p>
                    <p class="text-gray-400 text-sm">{{ booking.movieTitle }}</p>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <p class="text-red-400 font-semibold">{{ formatCurrency(booking.totalAmount) }}</p>
                <p class="text-gray-400 text-sm">{{ formatDateTime(booking.bookingDate) }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <p class="text-gray-400">Chưa có đặt vé nào</p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Phim phổ biến</h2>
            <NuxtLink
              to="/movies"
              class="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Xem tất cả phim
            </NuxtLink>
          </div>

          <div v-if="popularMovies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="movie in popularMovies"
              :key="movie.movieTitle"
              class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-white font-medium">{{ movie.movieTitle }}</p>
                <p class="text-gray-400 text-sm">{{ movie.bookingCount }} vé đã bán</p>
              </div>
              <div class="text-red-400 font-semibold">
                {{ formatCurrency(movie.revenue) }}
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <p class="text-gray-400">Chưa có dữ liệu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useDashboard } from '~/composables/useDashboard'
import { formatCurrency, formatDateTime } from '~/utils/formatters'
import type { DashboardData, DashboardStats, PopularMovie } from '~/interfaces/dashboard'
import type { Booking } from '~/interfaces/booking'
import type { User } from '~/interfaces/user'

const { currentUser, isAuthenticated } = useAuth()
const dashboardData = ref<DashboardData>({
  bookings: [],
  users: [],
  movies: []
})
const pending = ref(true)

useHead({
  title: 'Dashboard Admin - CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Dashboard quản trị hệ thống CinemaX'
    }
  ]
})

onMounted(async () => {
  if (!isAuthenticated.value || currentUser.value?.role !== 'admin') {
    await navigateTo('/')
  }

  const {
    fetchDashboardData,
  } = useDashboard()

  const data = await fetchDashboardData()
  dashboardData.value = data
  pending.value = false
})

const stats = computed<DashboardStats>(() => {
  if (!dashboardData.value) {
    return {
      totalMovies: 0,
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0
    }
  }
  const { calculateStats } = useDashboard()
  return calculateStats(dashboardData.value)
})

const recentBookings = computed<Booking[]>(() => {
  if (!dashboardData.value?.bookings) return []
  const { getRecentBookings } = useDashboard()
  return getRecentBookings(dashboardData.value.bookings, 5)
})

const popularMovies = computed<PopularMovie[]>(() => {
  if (!dashboardData.value?.bookings) return []
  const { getPopularMovies } = useDashboard()
  return getPopularMovies(dashboardData.value.bookings, 6)
})

const getUserInfo = (userId: string): User | undefined => {
  if (!dashboardData.value?.users) return undefined
  const { getUserInfo } = useDashboard()
  return getUserInfo(dashboardData.value.users, userId)
}
</script>
