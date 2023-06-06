import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'AdminLayout',
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
  history: import.meta.env.DEV ? createWebHistory() : createWebHashHistory(),
  routes,
});

export default router;
