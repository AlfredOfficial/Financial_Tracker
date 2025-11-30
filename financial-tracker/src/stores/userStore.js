import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null);
  const error = ref(null);

  // Actions
  const register = async (username, password) => {
    error.value = null;

    // 1. Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 2. Check if the user already exists
    if (users.find(user => user.username === username)) {
      error.value = 'Username already exists.';
      return false;
    }

    // 3. Add the new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    // 4. Log the new user in automatically after registration
    currentUser.value = { username };
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    
    return true;
  };

  const login = async (username, password) => {
    error.value = null;

    // 1. Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // 2. Find the user and verify credentials
    const foundUser = users.find(user => user.username === username && user.password === password);

    if (foundUser) {
      currentUser.value = { username };
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      return true;
    } else {
      error.value = 'Invalid username or password.';
      return false;
    }
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem('currentUser');
    // Note: Registered users remain in localStorage ('users')
  };

  return {
    currentUser,
    error,
    register,
    login,
    logout,
  };
});
