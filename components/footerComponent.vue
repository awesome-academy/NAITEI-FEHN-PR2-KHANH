<template>
    <footer class="bg-gray-800 border-t border-gray-700">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <UIcon name="i-heroicons-film" class="w-8 h-8 text-red-500" />
              <span class="text-xl font-bold">CinemaX</span>
            </div>
            <p class="text-gray-400 mb-4">
              Hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh tốt nhất.
              Mang đến trải nghiệm điện ảnh tuyệt vời cho khán giả.
            </p>
            <div class="flex space-x-4">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-red-500" />
              <span class="text-gray-400">Hotline: 1900 0000</span>
            </div>
            <div class="flex space-x-4">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-red-500 mt-1" />
              <span class="text-gray-400">Email: khanhdangAdmin@example.com</span>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/movies" class="text-gray-400 hover:text-white transition-colors">Phim đang chiếu</NuxtLink></li>
              <li><NuxtLink to="/movies/coming-soon" class="text-gray-400 hover:text-white transition-colors">Phim sắp chiếu</NuxtLink></li>
              <li><NuxtLink to="/cinemas" class="text-gray-400 hover:text-white transition-colors">Hệ thống rạp</NuxtLink></li>
              <li><NuxtLink to="/promotions" class="text-gray-400 hover:text-white transition-colors">Khuyến mãi</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/help" class="text-gray-400 hover:text-white transition-colors">Trợ giúp</NuxtLink></li>
              <li><NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors">Điều khoản</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">Bảo mật</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white transition-colors">Liên hệ</NuxtLink></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 CinemaX. Tất cả quyền được bảo lưu.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <UIcon name="i-heroicons-phone" class="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
</template>
