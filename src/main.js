import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入样式表
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入element-ui 的样式表
import 'element-ui/lib/theme-chalk/index.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  // 配置token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 定义一个全局过滤器
// 函数名是dateFormat 接收Value为参数
Vue.filter('dateFormat', (Value) => {
  // 将Value化为总毫秒数
  const dt = new Date(Value)
  // 获取年份
  const y = dt.getFullYear()
  // 获取月份
  // padStart方法是将值自动补齐 第一个参数表示几位数，第二个值表示不足两位数用 '0' 补齐
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // 获取日期
  const d = (dt.getDate() + '').padStart(2, '0')
  // 获取小时
  const hh = (dt.getHours() + '').padStart(2, '0')
  // 获取分钟
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // 获取秒数
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 拼接格式 并返回值
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
