import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/AppLogin.vue'),
  },
  {
    path: '/',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: {
      name: 'Cities',
    },
    children: [
      {
        path: '/cities',
        name: 'Cities',
        component: () => import('@/views/CitiesView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  // checkForUpdates();
  const requiresAuth = to.matched.some(
    (record: any) => record.meta.requiresAuth,
  );
  const isTokenSet = store.getters['authModule/isTokenSet'];
  if (requiresAuth && !isTokenSet) {
    return next({ name: 'login' });
  } // checkIfTokenNeedsRefresh(); //
  // store.commit('successModule/success', null); //
  // store.commit('errorModule/error', null);
  return next();
});

export default router;
