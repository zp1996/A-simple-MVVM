'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayMethods = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arrayProto = Array.prototype; // 数组的变化不能利用简单的 === 来判断
// 引用没变不能触发setter更新,解决办法就是重载数组的变化方法
var arrayMethods = exports.arrayMethods = (0, _create2.default)(arrayProto);

// 注意的是sort,splice,reverse改变的全部是原数组
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  var original = arrayProto[method];
  // 重载数组的方法
  (0, _util.def)(arrayMethods, method, function () {
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted = void 0;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // 获取到加入的元素
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observerArray(inserted);

    // 通知更新变化 
    ob.dep.notify();
    return result;
  });
});