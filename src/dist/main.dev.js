"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

require("./assets/css/global.css");

require("./plugins/element.js");

var _vueTableWithTreeGrid = _interopRequireDefault(require("vue-table-with-tree-grid"));

require("./assets/fonts/iconfont.css");

require("element-ui/lib/theme-chalk/index.css");

var _vueQuillEditor = _interopRequireDefault(require("vue-quill-editor"));

require("quill/dist/quill.core.css");

require("quill/dist/quill.snow.css");

require("quill/dist/quill.bubble.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 导入样式表
// 导入字体图标
// 导入element-ui 的样式表
// 导入富文本编辑器
// 导入富文本编辑器样式
// 配置请求的跟路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

_axios["default"].interceptors.request.use(function (config) {
  // console.log(config)
  // 配置token
  config.headers.Authorization = window.sessionStorage.getItem('token'); // 在最后必须 return config

  return config;
});

_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;

_vue["default"].component('tree-table', _vueTableWithTreeGrid["default"]); // 定义一个全局过滤器
// 函数名是dateFormat 接收Value为参数


_vue["default"].filter('dateFormat', function (Value) {
  // 将Value化为总毫秒数
  var dt = new Date(Value); // 获取年份

  var y = dt.getFullYear(); // 获取月份
  // padStart方法是将值自动补齐 第一个参数表示几位数，第二个值表示不足两位数用 '0' 补齐

  var m = (dt.getMonth() + 1 + '').padStart(2, '0'); // 获取日期

  var d = (dt.getDate() + '').padStart(2, '0'); // 获取小时

  var hh = (dt.getHours() + '').padStart(2, '0'); // 获取分钟

  var mm = (dt.getMinutes() + '').padStart(2, '0'); // 获取秒数

  var ss = (dt.getSeconds() + '').padStart(2, '0'); // 拼接格式 并返回值

  return "".concat(y, "-").concat(m, "-").concat(d, " ").concat(hh, ":").concat(mm, ":").concat(ss);
}); // 注册富文本编辑器为全局组件


_vue["default"].use(_vueQuillEditor["default"]);

new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');