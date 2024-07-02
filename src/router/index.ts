import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/pages/Login.vue'
import Register from '@/components/pages/Register.vue'
import Dashboard from "@/components/pages/Dashboard.vue"
import {useUser} from "@/composables/useUser"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: (_,__,next) => {
        const user = useUser()
        if(user) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      beforeEnter: (_,__,next) => {
        const user = useUser()
        if(user) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
      component: Dashboard
    }
  ]
})

export default router
