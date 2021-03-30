"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_elementUi.Button);

_vue["default"].use(_elementUi.Form);

_vue["default"].use(_elementUi.FormItem);

_vue["default"].use(_elementUi.Input);

_vue["default"].use(_elementUi.Container);

_vue["default"].use(_elementUi.Header);

_vue["default"].use(_elementUi.Aside);

_vue["default"].use(_elementUi.Main);

_vue["default"].use(_elementUi.Menu);

_vue["default"].use(_elementUi.Submenu);

_vue["default"].use(_elementUi.MenuItem);

_vue["default"].use(_elementUi.Breadcrumb);

_vue["default"].use(_elementUi.BreadcrumbItem);

_vue["default"].use(_elementUi.Card);

_vue["default"].use(_elementUi.Row);

_vue["default"].use(_elementUi.Col);

_vue["default"].use(_elementUi.Table);

_vue["default"].use(_elementUi.TableColumn);

_vue["default"].use(_elementUi.Switch);

_vue["default"].use(_elementUi.Tooltip);

_vue["default"].use(_elementUi.Pagination);

_vue["default"].use(_elementUi.Dialog);

_vue["default"].use(_elementUi.Tag);

_vue["default"].use(_elementUi.Tree);

_vue["default"].use(_elementUi.Select);

_vue["default"].use(_elementUi.Option);

_vue["default"].prototype.$message = _elementUi.Message;
_vue["default"].prototype.$confirm = _elementUi.MessageBox.confirm;