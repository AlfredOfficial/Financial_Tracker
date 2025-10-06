<script setup>
defineProps({
  transactions: Array
})
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Recent Transactions</h2>
    <ul v-if="transactions.length" class="divide-y divide-gray-200">
      <li v-for="t in transactions" :key="t.id" class="py-2 flex justify-between">
        <span>{{ t.desc }} ({{ t.category }})</span>
        <span :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'">₱{{ t.amount }}</span>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-sm">No transactions yet.</p>
  </div>
</template>