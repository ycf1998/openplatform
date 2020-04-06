官网：<https://panjiachen.github.io/vue-element-admin-site/zh/guide/#%E5%8A%9F%E8%83%BD>

# 介绍

[![vue](https://img.shields.io/badge/vue-2.6.10-brightgreen.svg)](https://github.com/vuejs/vue) [![element-ui](https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg)](https://github.com/ElemeFE/element) [![Build Status](https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master)](https://travis-ci.org/PanJiaChen/vue-element-admin) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) [![GitHub release](https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg)](https://github.com/PanJiaChen/vue-element-admin/releases) [![donate](https://img.shields.io/badge/%24-donate-ff69b4.svg)](https://panjiachen.gitee.io/vue-element-admin-site/zh/donate) [![GitHub stars](https://img.shields.io/github/stars/PanJiaChen/vue-element-admin.svg?style=social&label=Stars)](https://github.com/PanJiaChen/vue-element-admin)

[vue-element-admin](http://panjiachen.github.io/vue-element-admin) 是一个后台前端解决方案，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element)实现。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。

# 整合

首先我们最好把整个项目从github上拉下来，方便我们直接复制文件。

## layout布局

页面整体布局是一个产品最外层的框架结构，往往会包含导航、侧边栏、面包屑以及内容等。

![](https://panjiachen.gitee.io/gitee-cdn/vue-element-admin-site/7066d74f-12c5-47d6-b6ad-f22b43fec917.png)

它主要是layout这个文件夹，我们整个复制过来。他需要很多组件，我们就不改动layout，而是把他需要的组件都移入进来。移入项目的有如下：

>  -- src
>
> ​	-- layout（整个文件夹）
>
> ​	-- store （vuex的文件夹，先整个放进来，有些文件要更改）
>
> ​	-- component（至少移入以下几个组件）
>
> ​		-- Breadcrumb （面包屑导航）
>
> ​		-- Hamburger （汉堡包？这个我不知道那个）
>
> ​		-- HeaderSearch (头部搜索框)
>
> ​		-- RightPanel (系统布局配置，最右边的吸附板块，就是element的那个抽屉效果)
>
> ​		-- Screenfull （全屏，这个要安装npm install fuse.js Screenfull，反正你运行的时候会提示你装）
>
> ​		-- SizeSelect (侧边栏的图标字体样式)
>
> ​		-- ThemePicker (皮肤，可以更改皮肤)
>
> ​		-- SvgIcon （svgIcon组件，这个vue.config.js还要配置点东西）
>
> ​		-- ErrorLog (错误日志)
>
> ​	-- style （把他里面的都移入进去吧）
>
> ​	-- util (一些工具js，其中request.js是axios全局拦截器，一般我们都自己写了，这个看着放)
>
> ​	-- settings.js （一些功能的开关，如是否开启系统布局配置、选项卡等，这个可以复制下面的，中文）

settings.js

~~~js
module.exports = {
    title: '麦尼开放平台',

    /**
     * 是否系统布局配置
     */
    showSettings: true,

    /**
     * 是否显示 tagsView
     */
    tagsView: true,

    /**
     * 是否固定头部
     */
    fixedHeader: false,

    /**
     * 是否显示logo
     */
    sidebarLogo: true,

    /**
     * 错误日志在什么模式下开启
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production'
}
~~~

## 权限路由

### 权限 前端or后端 来控制？

有很多人表示他们公司的路由表是于后端根据用户的权限动态生成的，我司不采取这种方式的原因如下：

- 项目不断的迭代你会异常痛苦，前端新开发一个页面还要让后端配一下路由和权限，让我们想了曾经**前后端不分离**，被后端支配的那段恐怖时间了。
- 其次，就拿我司的业务来说，虽然后端的确也是有权限验证的，但它的验证其实是针对业务来划分的，比如超级编辑可以发布文章，而实习编辑只能编辑文章不能发布，但对于前端来说不管是超级编辑还是实习编辑都是有权限进入文章编辑页面的。所以前端和后端权限的划分是不太一致。
- 还有一点是就vue2.2.0之前异步挂载路由是很麻烦的一件事！不过好在官方也出了新的api，虽然本意是来解决ssr的痛点的。。。

### addRoutes

在之前通过后端动态返回前端路由一直很难做的，因为vue-router必须是要vue在实例化之前就挂载上去的，不太方便动态改变。**不过好在vue2.2.0以后新增了router.addRoutes**，可以动态挂载

总而言之，前后端对权限都有做法，前端控制页面权限，是否能访问；后端控制api，这个请求是否有权限执行。

### 1.路由设置

src/router/index.js

这里设置了几个测试页面，没有的记得自己加一下

~~~js
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
    // 重定向当前路由，用来切换布局大小的，
    {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {path: '/login', component: () => import('@/views/login'), hidden: true},
  {path: '/reg', component: () => import('@/views/reg'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home'),
      meta: {
        title: '首页',
        icon: 'home'
      }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [{
      path: 'index',
      component: () => import('@/views/profile'),
      name: 'profile',
      meta: {
        title: '个人主页',
        icon: 'user',
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

~~~

src/views/redirect/index.vue

~~~vue
<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    const newPath = '/' + path;
    this.$router.replace({ path: newPath, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>

~~~

### 2. Vuex store文件夹的更改

getters.js文件

~~~js
const getters = {

  sidebar: state => state.app.sidebar, // 侧边栏的打开与缩小
  size: state => state.app.size, // 路由大小
  device: state => state.app.device, // pc端或移动端(desktop or mobile)
  visitedViews: state => state.tagsView.visitedViews, // 数组，打开的选项卡
  cachedViews: state => state.tagsView.cachedViews, // 在配置路由的时候通过 meta.noCache 来设置是否需要缓存这个路由 默认都缓存
  errorLogs: state => state.errorLog.logs,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  type: state => state.user.type,
  roles: state => state.user.roles,

  permission_routes: state => state.permission.routes, // 默认公共路由，所有人可以访问
  addRoutes: state => state.permission.addRoutes // 动态分配的权限路由
}
export default getters

~~~

modules/permission.js文件

~~~js
import { asyncRoutes, constantRoutes } from '@/router';

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const permission = {
  state: {
    routes: constantRoutes,
    addRoutes: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    }
  },
  actions: {
      // 等下路由拦截动态添加路由，就是执行这个方法
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
         // 过滤之前写的动态路由
        const accessedRouters = asyncRoutes.filter(v => {
           // 如果角色是admin，不过滤，全部返回
          if (roles[0] === 'admin') return true;
           // 执行过滤，返回此roles能访问的路由
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        // 装填额外（需要权限且拥有）的路由
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

~~~

### 3.权限拦截

这个就是我们做业务拦截的地方了；

1. 创建vue实例的时候将vue-router挂载，但这个时候vue-router挂载一些登录或者不用权限的公用的页面。
2. 当用户登录后，获取用role，将role和路由表每个页面的需要的权限作比较，生成最终用户可访问的路由表。
3. 调用router.addRoutes(store.getters.addRouters)添加用户可访问的路由。
4. 使用vuex管理路由表，根据vuex中可访问的路由渲染侧边栏组件。

src/permission.js

~~~js
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  Message
} from 'element-ui'
import {
  getToken
} from '@/utils/auth' // 验权

const whiteList = ['/login', '/reg'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
    // 根据token判断是否已经登录
  if (getToken()) {
      // 已有token前往登录的话，直接帮他跳到主页面
    if (to.path === '/login') {
      next({ path: '/'})
      NProgress.done() 
    } else {
        // 不是去登陆，判断角色
      if (store.getters.roles.length === 0) {
          // 没有角色代表是刚到本网站，而不是网站内跳转，获取信息
        store.dispatch('GetInfo').then(res => { // 拉取info
          const roles = res.data.roles;
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
              // 执行这一句，或重新执行router.beforeEach这个钩子，也就是整个方法，防止还没挂载好				路由，很明显第二次已经有角色，会走else
            next({ ...to, replace: true }) 
          })
        }).catch(err => {
          console.log(err);
        });
      } else {
          // 已有角色，正常跳转
        next()
      }
    }
  } else {
      // 没有token，如果在白名单跳转，不是就重定向到登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
~~~

在main.js声明一下

~~~js
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js' // 引入elementUI

import '@/permission' // permission control
import '@/icons' // icon

import '@/styles/index.scss' // css


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

~~~



# 注意

**vue screenfull高版本5.0不可用**

可用重新安装依赖: npm install --save screenfull@4.2.1

**判断是否能全屏**

if (!screenfull.isEnabled) {