// src/stores/savingsStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTransactionStore } from './transactionStore' // Import the transaction store

export const useSavingsStore = defineStore('savings', () => {
  const txStore = useTransactionStore()

  // STATE: Goal amount, loaded from localStorage
  const goalAmount = ref(Number(localStorage.getItem('savingsGoal') || 0))

  // ----------------------------------------------------------------------
  // GETTERS (COMPUTED): Filter and calculate savings data
  // ----------------------------------------------------------------------

  // 1. Filtered list of all transactions marked as 'savings'.
  // 💡 FIX: Transactions moving money TO savings should be type: 'expense' 
  // to correctly reduce the spendable balance.
  const savingsTransactions = computed(() =>
    txStore.transactions.filter(t => t.type === 'expense' && (t.category === 'savings' || t.category === 'saving'))
  )

  // 2. Total amount saved
  // The sum remains the same, but it's now calculated from expense entries.
  const totalSavings = computed(() =>
    savingsTransactions.value.reduce((s, t) => s + Number(t.amount || 0), 0)
  )

  // 3. Progress percentage towards the goal (no change needed here)
  const progressPercentage = computed(() => {
    if (!goalAmount.value || goalAmount.value <= 0) return 0
    const p = Math.round((totalSavings.value / goalAmount.value) * 100)
    return Math.min(100, p)
  })

  // ----------------------------------------------------------------------
  // ACTIONS: Logic to update goal and add/remove entries
  // ----------------------------------------------------------------------

  // 1. Save the goal amount to localStorage (no change)
  function saveGoal() {
    localStorage.setItem('savingsGoal', String(Number(goalAmount.value || 0)))
  }

  // 2. Add a new saving transaction (delegates to transactionStore)
  async function addSavingEntry(amount, note) {
    const amt = Number(amount)
    if (!amt || amt <= 0) throw new Error('Enter a valid amount')

    await txStore.addTransaction({
      desc: note || 'Saved to Goal',
      amount: amt,
      // 💡 FIX: Changed type from 'income' to 'expense'
      type: 'expense', 
      category: 'savings' 
    })
  }

  // 3. Remove a saving transaction (delegates to transactionStore - no change)
  async function removeSavingEntry(txId) {
    await txStore.deleteTransaction(txId)
  }

  return {
    // State
    goalAmount,

    // Getters
    savingsTransactions,
    totalSavings,
    progressPercentage,

    // Actions
    saveGoal,
    addSavingEntry,
    removeSavingEntry
  }
})