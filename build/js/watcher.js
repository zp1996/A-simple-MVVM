"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _dep = require("./dep");

var _dep2 = _interopRequireDefault(_dep);

var _batcher = require("./batcher");

var _batcher2 = _interopRequireDefault(_batcher);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

var Watcher = function () {
    function Watcher(vm, exp, cb) {
        (0, _classCallCheck3.default)(this, Watcher);

        this.cb = cb; // 更新UI函数
        this.vm = vm;
        this.exp = exp;
        this.depIds = {}; // 数据依赖集合
        this.value = this.get();
        this.id = id++;
        this.run = (0, _util.debounce)(this.run);
    }

    (0, _createClass3.default)(Watcher, [{
        key: "update",
        value: function update() {
            var _this = this;

            var val = this.get();
            if (val !== this.value) {
                this.value = val;
                (0, _util.nextTick)(function () {
                    (0, _batcher2.default)(_this);
                });
            }
        }
    }, {
        key: "run",
        value: function run() {
            this.cb.call(null, this.get());
        }
    }, {
        key: "addDep",
        value: function addDep(dep) {
            if (!(0, _util.hasOwn)(this.depIds, dep.id)) {
                dep.addSub(this);
                this.depIds[dep.id] = dep;
            }
        }
    }, {
        key: "get",
        value: function get() {
            _dep2.default.target = this;
            var val = (0, _util.getValue)(this.vm, this.exp);
            _dep2.default.target = null;
            return val;
        }
    }]);
    return Watcher;
}();

module.exports = Watcher;