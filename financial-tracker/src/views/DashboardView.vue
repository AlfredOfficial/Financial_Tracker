<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useBudgetStore } from '../stores/budgetStore'

const userStore = useUserStore()
const txStore = useTransactionStore()
const budgetStore = useBudgetStore()
const router = useRouter()

const desc = ref('')
const amount = ref(0)
const type = ref('expense')
const category = ref('food')
const categoryFilter = ref('all')
const typeFilter = ref('all')
const searchFilter = ref('')

onMounted(() => {
  if (!userStore.user) router.push('/')
  txStore.loadTransactions()
  budgetStore.loadBudgets()
})

const budgetUsedClasses = computed(() => {
  const percentage = parseFloat(budgetStore.usedPercentage)

  if(percentage >= 100) {
    return 'text-red-700 bg-red-100'
  } else if(percentage >= 80) {
    return 'text-amber-700 bg-amber-100'
  } else {
    return 'text-purple-700 bg-purple-100'
  }
})

const filteredTransactions = computed(() => {
  return txStore.transactions.filter(tx => {
    const matchCategory = categoryFilter.value === 'all' || tx.category === categoryFilter.value
    const matchType = typeFilter.value === 'all' || tx.type === typeFilter.value
    const matchSearch = tx.desc.toLowerCase().includes(searchFilter.value.toLowerCase())
    return matchCategory && matchType && matchSearch
  })
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
  <div class="bg-white p-2 sm:p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
    <header class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Welcome, {{ userStore.user.username }}
        </h1>
        <p class="text-sm text-gray-600">Your personal finance dashboard</p>
      </div>
      <div class="flex space-x-2">
        <router-link to="/budget" class="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center">
          <i class="fas fa-chart-pie mr-2"></i> Budgets
        </router-link>
        <button @click="logout" class="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center">
          <i class="fas fa-sign-out-alt mr-2"></i> Log Out
        </button>
      </div>
    </header>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center">
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
      <div class="p-4 rounded-xl" :class="budgetUsedClasses.split(' ')[1]"> <p class="text-sm text-gray-600">Budget Used</p>
          <p id="budgetUsed" class="text-xl font-bold" :class="budgetUsedClasses.split(' ')[0]">
              {{ budgetStore.usedPercentage }}%
          </p>
      </div>
    </div>

    <!-- Transaction Filters -->
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
      <select v-model="categoryFilter" class="px-3 py-2 border rounded-lg">
        <option value="all">All Categories</option>
        <option v-for="cat in txStore.categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="typeFilter" class="px-3 py-2 border rounded-lg">
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input v-model="searchFilter" type="text" placeholder="Search transactions..." class="flex-1 px-3 py-2 border rounded-lg">
    </div>

    <!-- Add Transaction Section -->
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
        <button type="submit" class="col-span-2 py-2 bg-indigo-600 text-white rounded-lg">Add</button>
      </form>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-md">
      <h2 class="text-lg font-bold mb-3">Transactions</h2>
      <ul>
        <li v-for="tx in filteredTransactions" :key="tx.id" class="flex justify-between py-2 border-b">
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