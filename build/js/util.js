"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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
function isNative(fn) {
	return (/native code/.test(fn.toString())
	);
}
exports.nextTick = function () {
	var callbacks = []; // 更新dom队列
	var pending = false;
	var timerFunc;
	// 发布事件函数
	function nextTickHandler() {
		pending = false;
		var copies = callbacks.slice(0);
		callbacks.length = 0; // 发布完成后清空队列
		copies.forEach(function (cb) {
			cb();
		});
	}
	if (typeof _promise2.default !== "undefined" && isNative(_promise2.default)) {
		var p = _promise2.default.resolve();
		timerFunc = function timerFunc() {
			p.then(nextTickHandler);
		};
	} else if (typeof MutationObserver !== "undefined" && isNative(MutationObserver)) {
		var counter = 1;
		var observer = new MutationObserver(nextTickHandler);
		var textNode = document.createTextNode(counter);
		observer.observe(textNode, {
			characterData: true
		});
		timerFunc = function timerFunc() {
			// 每次调用timerFunc会触发nextTickHandler
			counter = (counter + 1) % 2;
			textNode.data = counter;
		};
	} else {
		timerFunc = function timerFunc() {
			setTimeout(nextTickHandler);
		};
	}
	return function (cb, ctx) {
		var func = ctx ? function () {
			cb.call(ctx);
		} : cb;
		callbacks.push(func);
		if (!pending) {
			// 注册一个回调
			pending = true;
			timerFunc();
		}
	};
}();