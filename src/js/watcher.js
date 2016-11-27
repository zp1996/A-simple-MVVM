import Dep from "./dep";
import {
	hasOwn,
	getValue
} from "./util";

class Watcher{
	constructor(vm, exp, cb) {
		this.cb = cb;    // 更新UI函数
		this.vm = vm;			
		this.exp = exp;
		this.depIds = {};   // 数据依赖集合
		this.value = this.get();
	}
	update() {
		const val = this.get();
		if (val !== this.value) {
			this.value = val;
			this.cb.call(null, val);
		}
	}
	addDep(dep) {
		if (!hasOwn(this.depIds, dep.id)) {
			dep.addSub(this);
			this.depIds[dep.id] = dep;
		}
	}
	get() {
		Dep.target = this;
		const val = getValue(this.vm, this.exp);
		Dep.target = null;
		return val;
	}
}

module.exports = Watcher;