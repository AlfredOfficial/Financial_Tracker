import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: ''
  }),

  actions: {
    async register(username, password) {
      try {
        if (!username || !password) {
          this.error = 'Username and password required'
          return false
        }

        const res = await axios.get(`http://localhost:3000/users?username=${username}`)
        if (res.data.length > 0) {
          this.error = 'Username already exists'
          return false
        }

        const newUser = { username, password }
        const result = await axios.post('http://localhost:3000/users', newUser)
        if (result.status === 201) {
          this.error = ''
          return true
        }
      } catch {
        this.error = 'Registration failed'
        return false
      }
    },

    async login(username, password) {
      try {
        if (!username || !password) {
          this.error = 'Username and password required'
          return false
        }

        const res = await axios.get(`http://localhost:3000/users?username=${username}&password=${password}`)
        if (res.data.length === 1) {
          this.user = res.data[0]
          localStorage.setItem('user', JSON.stringify(this.user))
          this.error = ''
          return true
        }

        this.error = 'Invalid credentials'
        return false
      } catch {
        this.error = 'Login failed'
        return false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
      this.error = ''
    }
  }
})
