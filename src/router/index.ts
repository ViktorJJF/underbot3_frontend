import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import('@/views/Assistants.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
