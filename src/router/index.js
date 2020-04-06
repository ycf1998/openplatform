import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

 // 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {path: '/login', component: () => import('@/views/login'), hidden: true},
  {path: '/reg', component: () => import('@/views/reg'), hidden: true},
  {path: '/active-dev', component: () => import('@/views/active-dev'), hidden: true},
  {path: '/reset-password', component: () => import('@/views/reset-password'), hidden: true},
  {path: '/set-new-password', component: () => import('@/views/set-new-password'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home'),
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true // 固定
      }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/profile'),
      name: 'Profile',
      meta: {
        title: '个人中心',
        noCache: true
      }
    }]
  },
  {
    path: '/icons',
    component: Layout,
    redirect: '/icons',
    children: [{
      path: 'icons',
      component: () => import('@/views/icons'),
      name: 'Icons',
      meta: {
        title: 'svg图标',
        noCache: true
      }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission',
    children: [{
      path: 'permission',
      component: () => import('@/views/permission'),
      name: 'permission',
      meta: {
        title: '权限',
        icon: 'user',
        role: ['admin', 'super_editor']
      }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
];


const createRouter = () => new Router({
  // 使用history必须要写base
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
