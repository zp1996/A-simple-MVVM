import {hasOwn, def} from "./util";
import Dep from "./dep";

class Observer{
	constructor(value) {
		this.value = value;
		def(value, "__ob__", this);
		this.walk(value);
		this.dep = new Dep();     
	}
	walk(obj) {
		const keys = Object.keys(obj);
		keys.forEach((key) => {
			defineReactive(this.value, key, obj[key]);
		});
	}
}
function defineReactive(obj, key, val) {
	const dep = new Dep(),
		property = Object.getOwnPropertyDescriptor(obj, key);
	if (property && !property.configurable) {
		return void 0;
	}	
	var childOb = observer(val);  
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: true,
		get: () => {
			if (Dep.target) {
				// 关联数据与dom节点
				dep.depend();
				if (childOb) {
					childOb.dep.depend();
				}
			}
			return val;
		},
		set: (newVal) => {
			if (newVal === val) {
				return void 0;
			}
			val = newVal;
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