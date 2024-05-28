import { createRouter, createWebHistory } from 'vue-router'
import index from '@/components/pages/index.vue'
import TheLogin from '@/components/pages/TheLogin.vue'
import TheRegister from '@/components/pages/TheRegister.vue'


// Don't make the pages as templates!!!
// Why dashboard imported lazy ?
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: index
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
    },{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import("@/components/pages/TheDashboard.vue")
    }
  ]
})

export default router
