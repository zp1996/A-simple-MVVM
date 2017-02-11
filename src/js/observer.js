import { hasOwn, def } from "./util";
import Dep from "./dep";
import { arrayMethods } from './array';

class Observer{
	constructor(value) {
		this.value = value;
		def(value, "__ob__", this);
		this.dep = new Dep();
		if (Array.isArray(value)) {
			const augment = value.__proto__ ? protoAugment : copyAugment;
			augment(
				value, 
				arrayMethods, 
				Object.keys(arrayMethods)
			);
			this.observerArray(value);
		} else {
			this.walk(value);  
		}
	}
	walk(obj) {
		const keys = Object.keys(obj);
		keys.forEach((key) => {
			defineReactive(this.value, key, obj[key]);
		});
	}
	// 给新增的元素增加响应式的变化
	observerArray(items) {
		for (let i = 0, l = items.length; i < l; i++) {
			observer(items[i]);
		}
	}
}
function protoAugment(target, src) {
	target.__proto__ = src;
}
function copyAugment(target, src, keys) {
	for (let i = 0, l = keys.length; i < l; i++) {
		const key = keys[i];
		def(target, key, src[key]);
	}
}
function defineReactive(obj, key, val) {
	const dep = new Dep(),
		property = Object.getOwnPropertyDescriptor(obj, key);
	if (property && !property.configurable) {
		return void 0;
	}	
	// 对于数据关联计算情况下,应调用自身所写的get/set
	// 如: data.a = 1; data.b = data.a + 1;
	// 要想a,b全部为响应式的,则需要手动设置a的set
	var getter = property.get,
		setter = property.set,
		childOb = observer(val);  
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: true,
		get: () => {
			var value = getter ? getter.call(obj) : val;
			if (Dep.target) {
				// 关联数据与dom节点
				dep.depend();
				if (childOb) {
					childOb.dep.depend();
				}
			}
			return value;
		},
		set: (newVal) => {
			var value = getter ? getter.call(obj) : val;
			if (newVal === value) {
				return void 0;
			}
			if (setter) {
				setter.call(obj, newVal);
			} else {
				val = newVal;
			}
			childOb = observer(val);
			dep.notify();
		}
	});
}
function observer(value) {
	if (!value || typeof value !== "object") {
		return void 0;
	} else if (hasOwn(value, "__ob__") &&
		value["__ob__"] instanceof Observer
	) {
		return void 0;
	}
	return new Observer(value);
}

module.exports = observer;