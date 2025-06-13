<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
    <div class="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <div class="flex justify-center">
          <UIcon name="i-heroicons-film" class="w-12 h-12 text-red-500" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-white">Đăng nhập</h2>
        <p class="mt-2 text-sm text-gray-400">
          Hoặc
          <NuxtLink to="/register" class="font-medium text-red-500 hover:text-red-400">
            đăng ký tài khoản mới
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-md">
          {{ errorMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="emailValue"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Email của bạn"
              >
              <p v-if="v$.email.$error" class="mt-1 text-sm text-red-400">
                {{ v$.email.$errors[0].$message }}
              </p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Mật khẩu</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Mật khẩu của bạn"
              >
              <p v-if="v$.password.$error" class="mt-1 text-sm text-red-400">
                {{ v$.password.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-300">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-red-500 hover:text-red-400">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || v$.$invalid"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-white animate-spin" />
            </span>
            {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter, useHead, useNuxtApp } from '#app'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

useHead({
  title: 'Đăng nhập - CinemaX'
})

const router = useRouter()
const toast = useNuxtApp().$toast
const { login } = useAuth()

const emailValue = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const rules = {
  email: {
    required: helpers.withMessage('Email là bắt buộc', required),
    email: helpers.withMessage('Email không hợp lệ', email)
  },
  password: {
    required: helpers.withMessage('Mật khẩu là bắt buộc', required)
  }
}

const v$ = useVuelidate(rules, { email: emailValue, password })

const handleLogin = async () => {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const result = await login(emailValue.value, password.value)
    if (result.success) {
      toast.success('Đăng nhập thành công!')
      router.push('/')
    } else {
      errorMessage.value = result.error || 'Email hoặc mật khẩu không chính xác'
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.')
  } finally {
    isLoading.value = false
  }
}
</script>
