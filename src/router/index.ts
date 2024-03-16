import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/test',
    name: 'TestView',
    component: () => import('@/views/TestView.vue'),
  },
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
      name: 'MatchesView',
    },
    children: [
      {
        path: '/matches',
        name: 'MatchesView',
        component: () => import('@/views/MatchesView.vue'),
      },
      {
        path: '/matches/:id',
        name: 'MatchDetail',
        component: () => import('@/views/MatchDetail.vue'),
      },
      {
        path: '/teams',
        name: 'TeamsView',
        component: () => import('@/views/TeamsView.vue'),
      },
      {
        path: '/simulator',
        name: 'SimulationView',
        component: () => import('@/views/SimulationView.vue'),
      },
      {
        path: '/simulator-2',
        name: 'SimulationView2',
        component: () => import('@/views/SimulationView2.vue'),
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
  // const requiresAuth = to.matched.some(
  //   (record: any) => record.meta.requiresAuth,
  // );
  // const isTokenSet = store.getters['authModule/isTokenSet'];
  // if (requiresAuth && !isTokenSet) {
  //   return next({ name: 'login' });
  // } // checkIfTokenNeedsRefresh(); //
  // // store.commit('successModule/success', null); //
  // // store.commit('errorModule/error', null);
  // return next();
});

export default router;
