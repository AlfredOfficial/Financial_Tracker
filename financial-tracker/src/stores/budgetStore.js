import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTransactionStore } from './transactionStore';

export const useBudgetStore = defineStore('budget', () => {
  // Get current username to scope localStorage keys
  const getUsername = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? user.username : 'guest';
  };

  // State
  const budgets = ref([]);

  // Actions
  const loadBudgets = () => {
    const username = getUsername();
    const storedBudgets = localStorage.getItem(`budgets_${username}`);
    if (storedBudgets) {
      budgets.value = JSON.parse(storedBudgets);
    }
  };

  const saveBudgets = () => {
    const username = getUsername();
    localStorage.setItem(`budgets_${username}`, JSON.stringify(budgets.value));
  };

  const addBudget = (newBudget) => {
    // Check if budget for the same category already exists
    const existingBudget = budgets.value.find(b => b.category === newBudget.category);
    if (existingBudget) {
      // For simplicity, we just update the existing one
      existingBudget.limit = newBudget.limit;
    } else {
      budgets.value.push({ ...newBudget, id: Date.now() });
    }
    saveBudgets();
  };

  const updateBudget = (updatedBudget) => {
    const index = budgets.value.findIndex(b => b.id === updatedBudget.id);
    if (index !== -1) {
      budgets.value[index] = updatedBudget;
      saveBudgets();
    }
  };

  const deleteBudget = (id) => {
    budgets.value = budgets.value.filter(b => b.id !== id);
    saveBudgets();
  };
  
  // Getters (Computed properties)
  const transactionStore = useTransactionStore();

  const totalBudget = computed(() => {
    return budgets.value.reduce((sum, budget) => sum + budget.limit, 0);
  });
  
  const totalSpent = computed(() => {
    const budgetedCategories = budgets.value.map(b => b.category);
    return transactionStore.transactions
      .filter(t => t.type === 'expense' && budgetedCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  const remainingBudget = computed(() => {
    const remaining = totalBudget.value - totalSpent.value;
    return remaining > 0 ? remaining : 0;
  });
  
  const overspentBudget = computed(() => {
    const overspent = totalSpent.value - totalBudget.value;
    return overspent > 0 ? overspent : 0;
  });

  const usedPercentage = computed(() => {
    if (totalBudget.value === 0) return 0;
    return ((totalSpent.value / totalBudget.value) * 100).toFixed(2);
  });

  return {
    budgets,
    totalBudget,
    remainingBudget,
    overspentBudget,
    usedPercentage,
    loadBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
});
