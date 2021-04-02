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

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 导入样式表
// 导入字体图标
// 导入element-ui 的样式表
// 配置请求的跟路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

_axios["default"].interceptors.request.use(function (config) {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token'); // 在最后必须 return config

  return config;
});

_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;

_vue["default"].component('tree-table', _vueTableWithTreeGrid["default"]);

new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');