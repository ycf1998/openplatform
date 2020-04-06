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
