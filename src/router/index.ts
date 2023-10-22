import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SuperTrendViewVue from '@/views/SuperTrendView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/supertrend',
      name: 'supertrend',
      component: SuperTrendViewVue
    },
  ]
})

export default router
