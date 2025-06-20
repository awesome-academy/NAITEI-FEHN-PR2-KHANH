<template>
  <header class="bg-gray-800 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <UIcon name="i-heroicons-film" class="w-8 h-8 text-red-500" />
          <span class="text-xl font-bold text-white">CinemaX</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" class="text-gray-300 hover:text-white transition-colors">
            Trang chủ
          </NuxtLink>
          <NuxtLink to="/movies" class="text-gray-300 hover:text-white transition-colors">
            Phim
          </NuxtLink>
          <NuxtLink to="/cinemas" class="text-gray-300 hover:text-white transition-colors">
            Rạp chiếu
          </NuxtLink>
          <NuxtLink to="/promotions" class="text-gray-300 hover:text-white transition-colors">
            Khuyến mãi
          </NuxtLink>
          <NuxtLink
            v-if="currentUser?.role === 'admin'"
            to="/admin"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Admin
          </NuxtLink>
        </nav>

        <div class="flex items-center space-x-4">
          <div class="hidden md:block relative">
            <input
              type="text"
              placeholder="Tìm phim..."
              class="bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
            <UIcon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <ClientOnly>
            <div v-if="!isAuthenticated" class="flex items-center space-x-2">
              <NuxtLink to="/login" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm cursor-pointer">
                Đăng nhập
              </NuxtLink>
              <NuxtLink to="/register" class="border border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded text-sm cursor-pointer">
                Đăng ký
              </NuxtLink>
            </div>

            <div v-else class="relative">
              <button
                type="button"
                @click.stop="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
              >
                <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="currentUser && currentUser.avatar"
                    :src="currentUser.avatar"
                    :alt="currentUser.fullName"
                    class="w-full h-full object-cover"
                  >
                  <UIcon v-else name="i-heroicons-user" class="w-5 h-5 text-gray-400" />
                </div>
                <span class="hidden md:inline-block">{{ currentUser ? currentUser.fullName : 'Người dùng' }}</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </button>

              <div
                v-show="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
              >
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Tài khoản của tôi
                </NuxtLink>
                <NuxtLink to="/bookings" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                  Vé đã đặt
                </NuxtLink>
                <NuxtLink
                  v-if="currentUser?.role === 'admin'"
                  to="/admin"
                  class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Quản trị hệ thống
                </NuxtLink>
                <button
                  type="button"
                  @click.stop="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </ClientOnly>

          <button class="md:hidden text-gray-300 hover:text-white">
            <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter, useNuxtApp } from '#app'

const router = useRouter()
const { currentUser, isAuthenticated, logout } = useAuth()

const isUserMenuOpen = ref(false)

const toggleUserMenu = (event: Event) => {
  event.stopPropagation()
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = () => {
  const result = logout()
  isUserMenuOpen.value = false

  if (result.success) {
    useNuxtApp().$toast.success('Đăng xuất thành công!')
    router.push('/')
  }
}

const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.relative')
  if (dropdown && !dropdown.contains(event.target as Node) && isUserMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>
