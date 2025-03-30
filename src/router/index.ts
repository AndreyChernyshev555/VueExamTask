import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/MainView.vue'),
    },
    {
      path: '/trip',
      name: 'trip',
      component: () => import('../views/TripView.vue'),
    },
  ],
})

export default router
