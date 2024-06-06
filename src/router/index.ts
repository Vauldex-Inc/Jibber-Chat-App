import { createRouter, createWebHistory } from 'vue-router'
import TheLogin from '@/components/pages/TheLogin.vue'
import TheRegister from '@/components/pages/TheRegister.vue'
import TheDashboard from "@/components/pages/TheDashboard.vue"
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
      component: TheLogin
    },
    {
      path: '/register',
      name: 'register',
      component: TheRegister
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
      component: TheDashboard
    }
  ]
})

export default router
