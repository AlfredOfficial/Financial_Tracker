
<script setup>
import { reactive, watch, toRefs } from 'vue'

const props = defineProps({
  show: Boolean,
  transaction: Object,
  categories: Array
})

const emit = defineEmits(['close', 'update'])

const editedTransaction = reactive({
  id: '',
  desc: '',
  amount: 0,
  type: 'income',
  category: ''
})

// Sync when modal opens
watch(() => props.transaction, (newVal) => {
  if (newVal) {
    Object.assign(editedTransaction, newVal)
  }
}, { immediate: true })

function saveEdit() {
  emit('update', { ...editedTransaction })
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-0"
  >
    <div class="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md">
      <h3 class="text-xl font-bold mb-4">Edit Transaction</h3>
      <form @submit.prevent="saveEdit" class="space-y-4">
        <input type="text" v-model="editedTransaction.desc" placeholder="Description" required class="w-full px-3 py-2 border rounded-lg">
        <input type="number" v-model.number="editedTransaction.amount" placeholder="Amount" required class="w-full px-3 py-2 border rounded-lg">

        <select v-model="editedTransaction.type" class="w-full px-3 py-2 border rounded-lg">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select v-model="editedTransaction.category" class="w-full px-3 py-2 border rounded-lg">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <div class="flex space-x-2">
          <button type="submit" class="flex-1 py-2 bg-green-600 text-white rounded-lg">Save</button>
          <button type="button" @click="closeModal" class="flex-1 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>