import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import BudgetView from '../views/BudgetView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/dashboard', component: DashboardView },
  { path: '/budget', component: BudgetView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
