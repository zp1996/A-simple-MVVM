"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uid = 0;

var Dep = function () {
    function Dep() {
        (0, _classCallCheck3.default)(this, Dep);

        this.id = uid++;
        this.subs = []; // 存储watcher
    }

    (0, _createClass3.default)(Dep, [{
        key: "addSub",
        value: function addSub(sub) {
            this.subs.push(sub);
        }
    }, {
        key: "removeSub",
        value: function removeSub(sub) {
            (0, _util.remove)(this.subs, sub);
        }
    }, {
        key: "depend",
        value: function depend() {
            // 将相关的watcher添加到subs中
            Dep.target.addDep(this);
        }
    }, {
        key: "notify",
        value: function notify() {
            // 遍历与该数据有关的Watcher
            this.subs.forEach(function (val) {
                val.update();
            });
        }
    }]);
    return Dep;
}();

Dep.target = null;

module.exports = Dep;