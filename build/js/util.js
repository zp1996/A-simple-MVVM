"use strict";

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.isFunction = function (fn) {
	return typeof fn === "function";
};
exports.copy = function (obj) {
	var res = {};
	for (var key in obj) {
		res[key] = obj[key];
	}
	return res;
};
exports.hasOwn = function (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};
exports.def = function (value, key, obj, enumerable) {
	console.log(obj);
	(0, _defineProperty2.default)(obj, key, {
		value: value,
		writeable: true,
		configurable: true,
		enumerable: !!enumerable
	});
};