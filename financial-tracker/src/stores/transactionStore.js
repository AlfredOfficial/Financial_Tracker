import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './userStore'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    categories: [
      'food', 'transport', 'bills', 'shopping',
      'entertainment', 'health', 'education', 'other'
    ]
  }),

  actions: {
    async loadTransactions() {
      const userStore = useUserStore()
      if (!userStore.user) return
      const res = await axios.get(`http://localhost:3000/transactions?userId=${userStore.user.id}`)
      this.transactions = res.data || []
    },

    async addTransaction(data) {
      const userStore = useUserStore()
      if (!userStore.user) return

      const newTx = {
        ...data,
        userId: userStore.user.id,
        amount: Number(data.amount),
        date: new Date().toISOString()
      }

      await axios.post('http://localhost:3000/transactions', newTx)
      await this.loadTransactions()
    },

    async deleteTransaction(id) {
      await axios.delete(`http://localhost:3000/transactions/${id}`)
      this.transactions = this.transactions.filter(t => t.id !== id)
    }
  },

  getters: {
    balance: state => {
      const income = state.transactions
        .filter(t => t.type === 'income')
        .reduce((a, b) => a + b.amount, 0)
      const expense = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((a, b) => a + b.amount, 0)
      return income - expense
    },

    income: state =>
      state.transactions
        .filter(t => t.type === 'income')
        .reduce((a, b) => a + b.amount, 0),

    expense: state =>
      state.transactions
        .filter(t => t.type === 'expense')
        .reduce((a, b) => a + b.amount, 0)
  }
})
