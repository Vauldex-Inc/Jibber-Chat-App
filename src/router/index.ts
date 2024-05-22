import { createRouter, createWebHistory } from 'vue-router'
import index from '@/components/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: index
    }
  ]
})

export default router
