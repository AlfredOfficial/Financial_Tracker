import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './userStore'
import { useTransactionStore } from './transactionStore'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: []
  }),

  actions: {
    async loadBudgets() {
      const userStore = useUserStore()
      if (!userStore.user) return
      const res = await axios.get(`http://localhost:3000/budgets?userId=${userStore.user.id}`)
      this.budgets = res.data
    },

    async addBudget(budget) {
    const userStore = useUserStore()
    if (!userStore.user) return

    const res = await axios.get(`http://localhost:3000/budgets?userId=${userStore.user.id}&category=${budget.category}`)
    if (res.data.length > 0) {
        const id = res.data[0].id
        await axios.patch(`http://localhost:3000/budgets/${id}`, { limit: budget.limit })
    } else {
        await axios.post('http://localhost:3000/budgets', {
        userId: userStore.user.id,
        category: budget.category,
        limit: budget.limit
        })
    }

    await this.loadBudgets()
    },

    async updateBudget(updateBudget) {
      await axios.patch(`http://localhost:3000/budgets/${updateBudget.id}`,{
        category: updateBudget.category,
        limit: updateBudget.limit
      })
      await this.loadBudgets()
    },
    async deleteBudget(id) {
      await axios.delete(`http://localhost:3000/budgets/${id}`)
      this.budgets = this.budgets.filter(b => b.id !== id)
    }
  },

  getters: {
    totalBudget: state => state.budgets.reduce((a, b) => a + b.limit, 0),

    usedBudget: (state) => {
      const txStore = useTransactionStore()
      let total = 0
      state.budgets.forEach(b => {
        const spent = txStore.transactions
          .filter(t => t.category === b.category && t.type === 'expense')
          .reduce((a, b) => a + b.amount, 0)
        total += spent
      })
      return total
    },

    usedPercentage: (state) => {
      const total = state.totalBudget
      const used = state.usedBudget
      return total > 0 ? ((used / total) * 100).toFixed(1) : 0
    },

    remainingBudget: (state) => {
      const remaining = state.totalBudget - state.usedBudget
      return Math.max(0, remaining)
    },

    overspentBudget: (state) => {
      const overspent = state.usedBudget - state.totalBudget
      return Math.max(0, overspent)
    }
  }
})
