import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入样式表
import './assets/css/global.css'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入element-ui 的样式表
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
