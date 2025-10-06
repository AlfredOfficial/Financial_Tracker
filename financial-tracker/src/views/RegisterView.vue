
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const registerUser = async () => {
  const success = await userStore.register(username.value, password.value)
  if (success) router.push('/')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-4 text-center">Create Account</h1>
      <form @submit.prevent="registerUser" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username" class="w-full border px-3 py-2 rounded-lg" required>
        <input v-model="password" type="password" placeholder="Password" class="w-full border px-3 py-2 rounded-lg" required>
        <button type="submit" class="w-full py-2 bg-green-600 text-white rounded-lg">Register</button>
      </form>
      <p v-if="userStore.error" class="text-red-600 mt-2 text-center">{{ userStore.error }}</p>
      <p class="mt-4 text-center text-sm text-gray-600">
        Have an account?
        <router-link to="/" class="text-blue-600">Login</router-link>
      </p>
    </div>
  </div>
</template>