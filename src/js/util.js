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
exports.def = function(value, key, obj, enumerable) {
	console.log(obj);
	Object.defineProperty(obj, key, {
		value: value,
		writeable: true,
		configurable: true,
		enumerable: !!enumerable
	});
};