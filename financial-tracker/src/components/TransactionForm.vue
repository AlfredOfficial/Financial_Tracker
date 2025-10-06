<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const desc = ref('')
const amount = ref(0)
const type = ref('income')
const category = ref('')

const submitForm = () => {
  emit('add', { id: Date.now(), desc: desc.value, amount: amount.value, type: type.value, category: category.value })
  desc.value = ''
  amount.value = 0
  category.value = ''
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
    <h3 class="font-semibold text-lg mb-2">Add New Transaction</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="desc" type="text" placeholder="Description" required class="w-full px-3 py-2 border rounded-lg">
      <input v-model.number="amount" type="number" placeholder="Amount" required class="w-full px-3 py-2 border rounded-lg">
      <select v-model="type" class="w-full px-3 py-2 border rounded-lg">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input v-model="category" type="text" placeholder="Category" required class="w-full px-3 py-2 border rounded-lg">
    </div>
    <button class="w-full py-2 bg-indigo-600 text-white rounded-lg">Add Transaction</button>
  </form>
</template>