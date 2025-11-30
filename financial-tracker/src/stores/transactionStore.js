import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  // State
  const transactions = ref([]);
  const categories = ['food', 'bills', 'salary', 'entertainment', 'travel', 'health', 'misc'];

  // Get current username to scope localStorage keys
  const getUsername = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? user.username : 'guest';
  };
  
  // Actions
  const loadTransactions = () => {
    const username = getUsername();
    const storedTransactions = localStorage.getItem(`transactions_${username}`);
    if (storedTransactions) {
      transactions.value = JSON.parse(storedTransactions);
    }
  };

  const saveTransactions = () => {
    const username = getUsername();
    localStorage.setItem(`transactions_${username}`, JSON.stringify(transactions.value));
  };

  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple unique ID
      date: new Date().toISOString(),
    };
    transactions.value.unshift(newTransaction); // Add to the beginning of the list
    saveTransactions();
  };

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(tx => tx.id !== id);
    saveTransactions();
  };

  // Getters (Computed properties)
  const income = computed(() => {
    return transactions.value
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const expense = computed(() => {
    return transactions.value
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const balance = computed(() => {
    return income.value - expense.value;
  });

  return {
    transactions,
    categories,
    income,
    expense,
    balance,
    loadTransactions,
    addTransaction,
    deleteTransaction,
  };
});
