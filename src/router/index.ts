import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';  // Admin Ansicht Komponente

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true, requiresAdmin: false } },
  { path: '/adminDashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/rentingDevice', name: 'Renting Device', component: () => import('../views/renting_devices.vue'), meta: { requiresAuth: true, requiresAdmin: false } },
  { path: '/rentingLocker', name: 'Renting Locker', component: () => import('../views/renting_locker.vue'), meta: { requiresAuth: true, requiresAdmin: false } },
  { path: '/reportProblem', name: 'Report a Problem', component: () => import('../views/report_a_problem.vue'), meta: { requiresAuth: true, requiresAdmin: false } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Or however you handle auth
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Admin status

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresAuth && requiresAdmin && !isAdmin) {
    // Redirect non-admin users trying to access admin-only pages
    next('/');
  } else {
    next();
  }
});

export default router;
