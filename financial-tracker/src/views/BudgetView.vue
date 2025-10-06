
<script setup>
import { ref, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
import { useBudgetStore } from '../stores/budgetStore'

const txStore = useTransactionStore()
const budgetStore = useBudgetStore()

const category = ref('')
const limit = ref('')

onMounted(() => {
  txStore.loadTransactions()
  budgetStore.loadBudgets()
})

const addBudget = async () => {
  if (!category.value || !limit.value) return
  await budgetStore.addBudget({ category: category.value, limit: parseFloat(limit.value) })
  category.value = ''
  limit.value = ''
}

const spent = (cat) => {
  return txStore.transactions
    .filter(t => t.category === cat && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

const progressWidth = (cat, limit) => {
  const total = spent(cat)
  const pct = (total / limit) * 100
  return pct > 100 ? 100 : pct
}
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-6">
    <header class="flex justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p class="text-sm text-gray-600">Set and track your spending limits</p>
      </div>
      <router-link to="/dashboard" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
        <i class="fas fa-arrow-left mr-2"></i>Back to Dashboard
      </router-link>
    </header>

    <div class="bg-gray-50 p-4 rounded-xl mb-6">
      <h2 class="text-lg font-bold mb-3">Add Budget</h2>
      <form @submit.prevent="addBudget" class="grid grid-cols-2 gap-3">
        <select v-model="category" class="border px-3 py-2 rounded-lg">
          <option disabled value="">Select category</option>
          <option v-for="cat in txStore.categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <input v-model.number="limit" type="number" placeholder="Amount limit" class="border px-3 py-2 rounded-lg" required>
        <button type="submit" class="col-span-2 py-2 bg-green-600 text-white rounded-lg">Add Budget</button>
      </form>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-3">Your Budgets</h2>
      <div v-if="budgetStore.budgets.length === 0" class="text-gray-600 text-center py-4">
        No budgets set yet.
      </div>

      <ul v-else class="space-y-4">
        <li v-for="b in budgetStore.budgets" :key="b.id" class="p-4 border rounded-xl">
          <div class="flex justify-between mb-2">
            <h3 class="font-semibold">{{ b.category }}</h3>
            <button @click="budgetStore.deleteBudget(b.id)" class="text-red-600"><i class="fas fa-trash"></i></button>
          </div>
          <div class="h-4 bg-gray-200 rounded-lg overflow-hidden">
            <div
              class="h-4 bg-blue-600"
              :style="{ width: progressWidth(b.category, b.limit) + '%' }">
            </div>
          </div>
          <div class="text-sm text-gray-700 mt-2">
            ₱{{ (spent(b.category) || 0).toFixed(2) }} of ₱{{ (b.limit || 0).toFixed(2) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>