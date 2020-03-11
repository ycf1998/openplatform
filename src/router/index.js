import Vue from 'vue'
import VueRouter from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/login', component: () => import('@/views/login/index.vue')},
  {path: '/reg', component: () => import('@/views/reg/index.vue')},
  {path: '/active-dev', component: () => import('@/views/active-dev')},
  {path: '/reset-password', component: () => import('@/views/reset-password')},
  {path: '/set-new-password', component: () => import('@/views/set-new-password')},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      meta: {
        title: '首页',
        icon: 'home'
      }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '*',
    component: () => import('@/views/404'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
