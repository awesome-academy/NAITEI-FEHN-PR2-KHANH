<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="relative mb-8">
        <h1 class="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-red-500 to-red-700 bg-clip-text animate-pulse">
          404
        </h1>
        <div class="absolute inset-0 text-9xl md:text-[12rem] font-bold text-red-500/20 blur-sm">
          404
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          Trang không tìm thấy
        </h2>
        <p class="text-gray-400 text-lg">
          Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ để khám phá các bộ phim mới nhất tại CinemaX.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          <span>Về trang chủ</span>
        </NuxtLink>

        <button
          class="border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          @click="goBack"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          <span>Quay lại</span>
        </button>
      </div>

      <div class="mt-12 flex justify-center space-x-4">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce"/>
        <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce" style="animation-delay: 0.1s"/>
        <div class="w-2 h-2 bg-red-500 rounded-full animate-bounce" style="animation-delay: 0.2s"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useHead } from '#app'

const _head = useHead({
  title: '404 - Trang không tìm thấy | CinemaX',
  meta: [
    {
      name: 'description',
      content: 'Trang bạn đang tìm kiếm không tồn tại. Quay lại trang chủ để khám phá các bộ phim mới nhất tại CinemaX.'
    }
  ]
})

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>
