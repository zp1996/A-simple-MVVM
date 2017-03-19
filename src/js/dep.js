import {remove} from "./util";

var uid = 0;
class Dep{
    constructor() {
        this.id = uid++;
        this.subs = [];  // 存储watcher
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    removeSub(sub) {
        remove(this.subs, sub);
    }
    depend() {
        // 将相关的watcher添加到subs中
        Dep.target.addDep(this);
    }
    notify() {
        // 遍历与该数据有关的Watcher
        this.subs.forEach((val) => {
            val.update();
        });
    }
}

Dep.target = null;

module.exports = Dep;