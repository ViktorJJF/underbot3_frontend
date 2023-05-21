import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/assistants',
    name: 'Assistants',
    component: () => import('@/views/Assistants.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
