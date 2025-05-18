import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/tabs/business'
  },
  {
    path: '/tabs/',
    component: () => import('../views/TabsPage.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/business'
      },
      {
        path: 'business',
        name: 'Business',
        component: () => import('../views/Tab1Page.vue')
      },
      {
        path: 'technical',
        name: 'Technical',
        component: () => import('../views/TechnicalPage.vue')
      },
      {
        path: 'kpis',
        name: 'KPIs',
        component: () => import('../views/KpiDashboardPage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
