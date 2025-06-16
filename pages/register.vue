<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
    <div class="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <div class="flex justify-center">
          <UIcon name="i-heroicons-film" class="w-12 h-12 text-red-500" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-white">Đăng ký tài khoản</h2>
        <p class="mt-2 text-sm text-gray-400">
          Hoặc
          <NuxtLink to="/login" class="font-medium text-red-500 hover:text-red-400">
            đăng nhập nếu đã có tài khoản
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-md">
          {{ errorMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-300">Họ và tên</label>
            <div class="mt-1">
              <input
                id="fullName"
                v-model="fullName"
                name="fullName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Họ và tên của bạn"
                @blur="v$.fullName.$touch()"
              >
              <p v-if="v$.fullName.$error" class="mt-1 text-sm text-red-400">
                {{ v$.fullName.$errors[0].$message }}
              </p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Email của bạn"
                @blur="v$.email.$touch()"
              >
              <p v-if="v$.email.$error" class="mt-1 text-sm text-red-400">
                {{ v$.email.$errors[0].$message }}
              </p>
            </div>
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-300">Số điện thoại</label>
            <div class="mt-1">
              <input
                id="phoneNumber"
                v-model="phoneNumber"
                name="phoneNumber"
                type="tel"
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Số điện thoại của bạn"
                @blur="v$.phoneNumber.$touch()"
              >
              <p v-if="v$.phoneNumber.$error" class="mt-1 text-sm text-red-400">
                {{ v$.phoneNumber.$errors[0].$message }}
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
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Mật khẩu của bạn"
                @blur="v$.password.$touch()"
              >
              <p v-if="v$.password.$error" class="mt-1 text-sm text-red-400">
                {{ v$.password.$errors[0].$message }}
              </p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300">Xác nhận mật khẩu</label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Nhập lại mật khẩu"
                @blur="v$.confirmPassword.$touch()"
              >
              <p v-if="v$.confirmPassword.$error" class="mt-1 text-sm text-red-400">
                {{ v$.confirmPassword.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 text-white animate-spin" />
            </span>
            {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
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
import { required, email as emailValidator, minLength, sameAs, helpers } from '@vuelidate/validators'

useHead({
  title: 'Đăng ký - CinemaX'
})

const router = useRouter()
const { register } = useAuth()
const toast = useNuxtApp().$toast

const fullName = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const rules = {
  fullName: {
    required: helpers.withMessage('Họ và tên là bắt buộc', required),
    minLength: helpers.withMessage('Họ và tên phải có ít nhất 3 ký tự', minLength(3))
  },
  email: {
    required: helpers.withMessage('Email là bắt buộc', required),
    email: helpers.withMessage('Email không hợp lệ', emailValidator)
  },
  phoneNumber: {
    validPhone: helpers.withMessage('Số điện thoại không hợp lệ', (value: string) => {
      if (!value) return false
      return /^[0-9]{10,11}$/.test(value)
    })
  },
  password: {
    required: helpers.withMessage('Mật khẩu là bắt buộc', required),
    minLength: helpers.withMessage('Mật khẩu phải có ít nhất 6 ký tự', minLength(6))
  },
  confirmPassword: {
    required: helpers.withMessage('Vui lòng xác nhận mật khẩu', required),
    sameAsPassword: helpers.withMessage('Mật khẩu xác nhận không khớp', sameAs(password))
  }
}

const v$ = useVuelidate(rules, { fullName, email, phoneNumber, password, confirmPassword })

const handleRegister = async () => {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast.error('Vui lòng kiểm tra lại thông tin đăng ký')
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const result = await register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value
    })


    if (result.success) {
      toast.success('Đăng ký thành công! Chào mừng bạn đến với CinemaX.')
      router.push('/')
    } else {
      toast.error(result.error || 'Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau.')
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.message || 'Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau.')
  } finally {
    isLoading.value = false
  }
}
</script>
