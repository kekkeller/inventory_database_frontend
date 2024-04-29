import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import Categories from "@/views/Categories.vue";
import Devices from "@/views/Devices.vue";
import Bookings from "@/views/Bookings.vue";
import User from "@/views/User.vue";
import ProblemReports from "@/views/ProblemReports.vue";

const routes: Array<RouteRecordRaw> = [

  { path: '/adminDashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/categories', name: 'Categories', component: Categories, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/devices', name: 'Devices', component: Devices, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/bookings', name: 'Bookings', component: Bookings, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/user', name: 'User', component: User, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/problemReports', name: 'Problem Reports', component: ProblemReports, meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true, requiresAdmin: false } },
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
  const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Überprüfe, wie dieser Wert gesetzt wird.
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true'; // Admin Status

  console.log('Auth:', isAuthenticated, 'Admin:', isAdmin); // Logging zur Diagnose

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresAuth && requiresAdmin && !isAdmin) {
    next('/');
  } else {
    next();
  }
});


export default router;
