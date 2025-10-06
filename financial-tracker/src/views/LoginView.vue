<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const loginUser = async () => {
  const success = await userStore.login(username.value, password.value)
  if (success) router.push('/dashboard')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-4 text-center">Finance Tracker Pro</h1>
      <form @submit.prevent="loginUser" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username" class="w-full border px-3 py-2 rounded-lg" required>
        <input v-model="password" type="password" placeholder="Password" class="w-full border px-3 py-2 rounded-lg" required>
        <button type="submit" class="w-full py-2 bg-blue-600 text-white rounded-lg">Login</button>
      </form>
      <p v-if="userStore.error" class="text-red-600 mt-2 text-center">{{ userStore.error }}</p>
      <p class="mt-4 text-center text-sm text-gray-600">
        No account?
        <router-link to="/register" class="text-blue-600">Register</router-link>
      </p>
    </div>
  </div>
</template>