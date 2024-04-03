import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/rentingDevice', name: 'Renting Device', component: () => import('../views/renting_devices.vue'), meta: { requiresAuth: true } },
  { path: '/rentingLocker', name: 'Renting Locker', component: () => import('../views/renting_locker.vue'), meta: { requiresAuth: true } },
  { path: '/reportProblem', name: 'Report a Problem', component: () => import('../views/report_a_problem.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue'),},
]

const router = createRouter({
  history: createWebHistory(),

  routes,
})
// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Or however you handle auth

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router
