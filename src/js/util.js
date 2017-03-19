exports.isFunction =function(fn) {
    return typeof fn === "function";
};
exports.copy = function(obj) {
    const res = {};
    for (let key in obj) {
        res[key] = typeof obj[key] === "object" 
            ? JSON.parse(JSON.stringify(obj[key])) : obj[key];
    }
    return res;
};
exports.hasOwn = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
exports.def = function(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        value: value,
        writeable: true,
        configurable: true,
        enumerable: !!enumerable
    });
};
exports.remove = function(arr, val) {
    var index = arr.indexOf(val);
    if (~index) {
        arr.splice(index, 1);
    }
};
exports.replace = function(nodeA, nodeB) {
    const parent = nodeA.parentNode;
    parent.replaceChild(nodeB, nodeA);
};
exports.insertBefore = function(nodeA, nodeB) {
    const parent = nodeB.parentNode;
    parent.insertBefore(nodeA, nodeB);
};
exports.isScript = function(node) {
    return node.tagName === "SCRIPT";
};
exports.getValue = function(vm, path) {
    var val = vm._data;
    path = path.split(".");
    path.forEach((key) => {
        val = val[key];
    });
    return val;
};
exports.setValue = function(vm, path, value) {
    var val = vm._data;
    path = path.split(".");
    const len = path.length;
    path.forEach((k, i) => {
        if (i < len - 1) {
            val = val[k];
        } else {
            val[k] = value;
        }
    });
};
function isNative (fn) {
    return /native code/.test(fn.toString());
}
exports.nextTick = (function () {
    var callbacks = [];   // 更新dom队列
    var pending = false;
    var timerFunc;
    // 发布事件函数
    function nextTickHandler() {
        pending = false;
        var copies = callbacks.slice(0);
        callbacks.length = 0; // 发布完成后清空队列
        copies.forEach(cb => {
            cb();
        });
    }
    if (typeof Promise !== "undefined" && isNative(Promise)) {
        var p = Promise.resolve();
        timerFunc = function() {
            p.then(nextTickHandler);
        };
    } else if (
        typeof MutationObserver !== "undefined" && 
        isNative(MutationObserver)
    ) {
        var counter = 1;
        var observer = new MutationObserver(nextTickHandler);
        var textNode = document.createTextNode(counter);
        observer.observe(textNode, {
          characterData: true
        });
        timerFunc = function () {  
            // 每次调用timerFunc会触发nextTickHandler
            counter = (counter + 1) % 2;
            textNode.data = counter;
        };
    } else {
        timerFunc = function() {
            setTimeout(nextTickHandler);
        }
    }
    return function(cb, ctx) {
        var func = ctx ? function () {
            cb.call(ctx);
        } : cb;
        callbacks.push(func);
        if (!pending) {    // 注册一个回调
            pending = true;
            timerFunc();
        }
    }
})();
exports.debounce = fn => {
    let immediate = null;
    return function(...items) {
        if (immediate) clearImmediate(immediate);
        immediate = setImmediate(() => {
            fn.apply(this, items);
        });
    };
};