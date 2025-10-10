<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ budget: Object })
const emit = defineEmits(['save', 'close'])

const editBudget = ref({ ...props.budget })

watch(() => props.budget, (newBudget) => {
  editBudget.value = { ...newBudget }
})

function saveEdit() {
  emit('save', editBudget.value)
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Budget</h2>

      <form @submit.prevent="saveEdit" class="space-y-4">
        <!-- Category Field -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Category</label>
          <input
            v-model="editBudget.category"
            type="text"
            placeholder="Enter category"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <!-- Limit Field -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Limit (₱)</label>
          <input
            v-model.number="editBudget.limit"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter limit amount"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>