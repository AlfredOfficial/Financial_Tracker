<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'

const txStore = useTransactionStore()

// form / UI state
const showForm = ref(false)
const amount = ref(null)
const note = ref('')
const goalAmount = ref(Number(localStorage.getItem('savingsGoal') || 0))

onMounted(() => {
  txStore.loadTransactions().catch(err => console.error('loadTransactions failed', err))
})

// total saved: income transactions with category 'savings'
const totalSavings = computed(() =>
  txStore.transactions
    .filter(t => t.type === 'income' && (t.category === 'savings' || t.category === 'saving'))
    .reduce((s, t) => s + Number(t.amount || 0), 0)
)

const progressPercentage = computed(() => {
  if (!goalAmount.value || goalAmount.value <= 0) return 0
  const p = Math.round((totalSavings.value / goalAmount.value) * 100)
  return Math.min(100, p)
})

function saveGoal() {
  localStorage.setItem('savingsGoal', String(Number(goalAmount.value || 0)))
}

async function addSaving() {
  const amt = Number(amount.value)
  if (!amt || amt <= 0) return alert('Enter a valid amount')
  try {
    await txStore.addTransaction({
      desc: note.value || 'Saved',
      amount: amt,
      type: 'income',
      category: 'savings'
    })
    // reset
    amount.value = null
    note.value = ''
    showForm.value = false
  } catch (err) {
    console.error('addSaving failed', err)
    alert('Failed to add saving — check console/network')
  }
}

async function removeSaving(tx) {
  if (!confirm('Delete this saving entry?')) return
  try {
    await txStore.deleteTransaction(tx.id)
  } catch (err) {
    console.error('deleteTransaction failed', err)
    alert('Failed to delete — check console/network')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Savings Overview</h1>
      <router-link
        to="/dashboard"
        class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
      >
        Back to Dashboard
      </router-link>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p class="text-sm text-gray-500">Total Savings</p>
          <div class="text-3xl font-bold text-green-600">₱{{ totalSavings.toFixed(2) }}</div>
        </div>

        <div class="w-full md:w-2/5">
          <label class="block text-sm text-gray-600 mb-2 font-medium">Goal Amount</label>
          <div class="flex gap-2">
            <input
              v-model.number="goalAmount"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              @click="saveGoal"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-3">Progress: {{ progressPercentage }}%</p>

          <div class="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
            <div
              class="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-2">
        <button
          @click="showForm = !showForm"
          class="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          {{ showForm ? 'Cancel' : 'Add Saving' }}
        </button>
      </div>

      <div v-if="showForm" class="mt-6 border-t pt-6">
        <form @submit.prevent="addSaving" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            v-model.number="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            v-model="note"
            type="text"
            placeholder="Note (optional)"
            class="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-lg">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Saving Entries</h2>
      <ul>
        <li
          v-for="tx in txStore.transactions.filter(t => t.type === 'income' && (t.category === 'savings' || t.category === 'saving'))"
          :key="tx.id"
          class="flex items-center justify-between py-3 border-b border-gray-200"
        >
          <div>
            <div class="font-medium text-gray-800">{{ tx.desc || 'Saved' }}</div>
            <div class="text-sm text-gray-500">{{ new Date(tx.date).toLocaleString() }}</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-green-600 font-semibold">₱{{ Number(tx.amount).toFixed(2) }}</div>
            <button
              @click="removeSaving(tx)"
              class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
            >
             <i class="fas fa-trash"></i>
            </button>
          </div>
        </li>
        <li
          v-if="txStore.transactions.filter(t => t.type === 'income' && (t.category === 'savings' || t.category === 'saving')).length === 0"
          class="py-3 text-sm text-gray-500 text-center"
        >
          No saving entries yet.
        </li>
      </ul>
    </div>
  </div>
</template>
