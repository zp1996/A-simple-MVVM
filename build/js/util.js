"use strict";

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.isFunction = function (fn) {
	return typeof fn === "function";
};
exports.copy = function (obj) {
	var res = {};
	for (var key in obj) {
		res[key] = (0, _typeof3.default)(obj[key]) === "object" ? JSON.parse((0, _stringify2.default)(obj[key])) : obj[key];
	}
	return res;
};
exports.hasOwn = function (obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
};
exports.def = function (obj, key, value, enumerable) {
	(0, _defineProperty2.default)(obj, key, {
		value: value,
		writeable: true,
		configurable: true,
		enumerable: !!enumerable
	});
};
exports.remove = function (arr, val) {
	var index = arr.indexOf(val);
	if (~index) {
		arr.splice(index, 1);
	}
};
exports.replace = function (nodeA, nodeB) {
	var parent = nodeA.parentNode;
	parent.replaceChild(nodeB, nodeA);
};
exports.isScript = function (node) {
	return node.tagName === "SCRIPT";
};
exports.getValue = function (vm, path) {
	var val = vm._data;
	path = path.split(".");
	path.forEach(function (key) {
		val = val[key];
	});
	return val;
};
exports.setValue = function (vm, path, value) {
	var val = vm._data;
	path = path.split(".");
	var len = path.length;
	path.forEach(function (k, i) {
		if (i < len - 1) {
			val = val[k];
		} else {
			val[k] = value;
		}
	});
};