import Dep from "./dep";
import pushWatcher from "./batcher";
import {
	hasOwn,
	getValue,
	nextTick
} from "./util";
var id = 0;
class Watcher{
	constructor(vm, exp, cb) {
		this.cb = cb;    // 更新UI函数
		this.vm = vm;			
		this.exp = exp;
		this.depIds = {};   // 数据依赖集合
		this.value = this.get();
		this.id = id++;
	}
	update() {
		const val = this.get();
		if (val !== this.value) {
			this.value = val;
			nextTick(() => {
				pushWatcher(this);
			});
		}
	}
	run() {
		this.cb.call(null, this.get());
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