<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useTransactionStore } from '../stores/transactionStore'

const userStore = useUserStore()
const txStore = useTransactionStore()
const router = useRouter()

const desc = ref('')
const amount = ref(0)
const type = ref('expense')
const category = ref('food')

onMounted(() => {
  if (!userStore.user) router.push('/')
  txStore.loadTransactions()
})

const addTransaction = async () => {
  await txStore.addTransaction({
    desc: desc.value,
    amount: parseFloat(amount.value),
    type: type.value,
    category: category.value
  })
  desc.value = ''
  amount.value = 0
}

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <header class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Welcome, {{ userStore.user.username }}</h1>
        <p class="text-sm text-gray-600">Your finance dashboard</p>
      </div>
      <div class="flex gap-2">
        <router-link to="/budget" class="px-4 py-2 bg-purple-600 text-white rounded-lg">Budgets</router-link>
        <button @click="logout" class="px-4 py-2 bg-gray-800 text-white rounded-lg">Logout</button>
      </div>
    </header>

    <div class="grid grid-cols-3 gap-4 mb-6 text-center">
      <div class="bg-green-100 p-4 rounded-xl">
        <p class="text-sm text-gray-600">Income</p>
        <p class="text-xl font-bold text-green-700">₱{{ txStore.income.toFixed(2) }}</p>
      </div>
      <div class="bg-red-100 p-4 rounded-xl">
        <p class="text-sm text-gray-600">Expenses</p>
        <p class="text-xl font-bold text-red-700">₱{{ txStore.expense.toFixed(2) }}</p>
      </div>
      <div class="bg-blue-100 p-4 rounded-xl">
        <p class="text-sm text-gray-600">Balance</p>
        <p class="text-xl font-bold text-blue-700">₱{{ txStore.balance.toFixed(2) }}</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-lg font-bold mb-3">Add Transaction</h2>
      <form @submit.prevent="addTransaction" class="grid grid-cols-2 gap-3">
        <input v-model="desc" type="text" placeholder="Description" class="border px-3 py-2 rounded-lg" required>
        <input v-model.number="amount" type="number" placeholder="Amount" class="border px-3 py-2 rounded-lg" required>
        <select v-model="type" class="border px-3 py-2 rounded-lg">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select v-model="category" class="border px-3 py-2 rounded-lg">
          <option v-for="cat in txStore.categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <button type="submit" class="col-span-2 py-2 bg-blue-600 text-white rounded-lg">Add</button>
      </form>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-md">
      <h2 class="text-lg font-bold mb-3">Transactions</h2>
      <ul>
        <li v-for="tx in txStore.transactions" :key="tx.id" class="flex justify-between py-2 border-b">
          <div>
            <p class="font-semibold">{{ tx.desc }}</p>
            <p class="text-xs text-gray-500">{{ tx.category }} | {{ tx.type }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <span :class="tx.type === 'income' ? 'text-green-600' : 'text-red-600'">₱{{ tx.amount }}</span>
            <button @click="txStore.deleteTransaction(tx.id)" class="text-red-600"><i class="fas fa-trash"></i></button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>