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
      path: '/supertrend/:symbol/:period/:from/:to',
      name: 'supertrend',
      component: SuperTrendViewVue,
      /*
      props: (route: any) => {
        console.log('HELKLO')
        console.log(route.query.symbol);

        return ({ 
          symbol: route.query.symbol,
          period: route.query.period,
          from: route.query.from,
          to: route.query.to,
        });
      },
      */
      props: true
    }
  ]
})

export default router
