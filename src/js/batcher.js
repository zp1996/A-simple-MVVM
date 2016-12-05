import {nextTick} from "./util";

const queue = [];     // 更新UI队列
var has = {},  			  // 队列中是否含有该Watcher
	waiting = false; 
function reset() {
	queue.length = 0;
	has = {};
	waiting = false;
}
function flush() {
	queue.forEach(watcher => {
		watcher.run();
	});
	reset();	
}
function pushWatcher(watcher) {
	const id = watcher.id;
	if (has[id] == null) {
		has[id] = queue.length;
		queue.push(watcher);
		if (!waiting) {
			waiting = true;
			nextTick(flush);
		}
	} else {
		queue[has[id]] = watcher;
	}
}
module.exports = pushWatcher;