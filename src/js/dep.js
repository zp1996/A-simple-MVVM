import {remove} from "./util";

var uid = 0;
class Dep{
	constrcutor() {
		this.id = uid++;
		this.subs = [];
	}
	addSub(sub) {
		this.subs.push(sub);
	}
	removeSub(sub) {
		remove(this.subs, sub);
	}
	depend() {
		Dep.target.addDep(this);
	}
	notify() {
		this.subs.forEach((val) => {
			val.update();
		});
	}
}

Dep.target = null;

module.exports = Dep;