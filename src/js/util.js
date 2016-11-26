exports.isFunction =function(fn) {
	return typeof fn === "function";
};
exports.copy = function(obj) {
	const res = {};
	for (let key in obj) {
		res[key] = obj[key];
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
exports.isScript = function(node) {
	return node.tagName === "SCRIPT";
};