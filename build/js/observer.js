"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require("./util");

var _dep = require("./dep");

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Observer = function () {
	function Observer(value) {
		(0, _classCallCheck3.default)(this, Observer);

		this.value = value;
		(0, _util.def)(value, "__ob__", this);
		this.walk(value);
	}

	(0, _createClass3.default)(Observer, [{
		key: "walk",
		value: function walk(obj) {
			var _this = this;

			var keys = (0, _keys2.default)(obj);
			keys.forEach(function (key) {
				defineReactive(_this.value, key, obj[key]);
			});
		}
	}]);
	return Observer;
}();

function defineReactive(obj, key, val) {
	var dep = new _dep2.default(),
	    property = (0, _getOwnPropertyDescriptor2.default)(obj, key);
	if (property && !property.configurable) {
		return void 0;
	}
	var childOb = observer(val);
	(0, _defineProperty2.default)(obj, key, {
		configurable: true,
		enumerable: true,
		get: function get() {
			if (_dep2.default.target) {
				dep.depend();
				if (childOb) {
					childOb.dep.depend();
				}
			}
			return val;
		},
		set: function set(newVal) {
			if (newVal === val) {
				return void 0;
			}
			val = newVal;
			childOb = observer(val);
			//dep.notify();
		}
	});
}
function observer(value) {
	if (!value || (typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) !== "object") {
		return void 0;
	} else if ((0, _util.hasOwn)(value, "__ob__") && value["__ob__"] instanceof Observer) {
		return void 0;
	}
	return new Observer(value);
}

module.exports = observer;