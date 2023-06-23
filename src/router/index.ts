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
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: {
      name: 'Assistants',
    },
    children: [
      {
        path: '/assistants',
        name: 'Assistants',
        component: () => import('@/views/AssistantsView.vue'),
      },
      {
        path: '/assistants/statistics',
        name: 'Statistics',
        component: () => import('@/views/Statistics.vue'),
      },
      // {
      //   path: '/assistants/update',
      //   name: 'Assistant',
      //   component: () => import('@/src/views/Assistants.vue'),
      // },
      {
        path: '/assistants/documents',
        name: 'Documents',
        component: () => import('@/views/Documents/index.vue'),
      },
      {
        path: '/assistants/documents/:document_id',
        name: 'DocumentsUpdate',
        component: () => import('@/views/Documents/update.vue'),
      },
      {
        path: '/assistants/intents',
        name: 'Intents',
        component: () => import('@/views/IntentsView.vue'),
      },
      {
        path: '/assistants/entities',
        name: 'Entities',
        component: () => import('@/views/EntitiesView.vue'),
      },
      {
        path: '/assistants/dialog',
        name: 'Dialog',
        component: () => import('@/views/DialogView.vue'),
      },
      {
        path: '/assistants/products',
        name: 'Products',
        component: () => import('@/views/ProductsView.vue'),
      },
      {
        path: '/assistants/playground',
        name: 'Playground',
        component: () => import('@/views/PlaygroundView.vue'),
      },
      {
        path: '/assistants/playground/recommender',
        name: 'PlaygroundRecommender',
        component: () => import('@/views/PlaygroundView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // checkForUpdates();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isTokenSet = store.getters['authModule/isTokenSet'];
  if (requiresAuth && !isTokenSet) {
    return next({ name: 'login' });
  } // checkIfTokenNeedsRefresh(); //
  // store.commit('successModule/success', null); //
  // store.commit('errorModule/error', null);
  return next();
});

export default router;
