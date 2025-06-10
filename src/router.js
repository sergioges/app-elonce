import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import CalendarView from './views/CalendarView.vue'
import AdminView from './views/AdminView.vue'
import ConfirmationView from './views/ConfirmationView.vue'

const routes = [
  {
    path: '/',
    redirect: '/calendar'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: ConfirmationView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/calendar'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authToken = localStorage.getItem('authToken')

  if (to.meta.requiresAuth) {
    if (!authToken) {
      console.warn('No se encontró authToken. Redirigiendo al login...')
      return next({ path: '/login', replace: true })
    }
    return next()
  }
  next()
})

export default router
