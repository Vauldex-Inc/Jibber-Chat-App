import { createRouter, createWebHistory } from 'vue-router'
import index from '@/components/pages/index.vue'
import TheLogin from '@/components/pages/TheLogin.vue'

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
    }
  ]
})

export default router
