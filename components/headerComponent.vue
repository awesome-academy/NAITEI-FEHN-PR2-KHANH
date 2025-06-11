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

            <div class="flex items-center space-x-2">
              <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm cursor-pointer">
              Đăng nhập
              </button>
              <button class="border border-gray-400 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded text-sm cursor-pointer">
              Đăng ký
              </button>
            </div>

            <button class="md:hidden text-gray-300 hover:text-white">
              <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
</template>
