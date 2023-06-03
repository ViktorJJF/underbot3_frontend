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
      {
        path: '/assistants/update',
        name: 'Assistant',
        component: () => import('@/views/AssistantsUpdate.vue'),
      },
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
        path: '/assistants/entities',
        name: 'Entities',
        component: () => import('@/views/Entities.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
