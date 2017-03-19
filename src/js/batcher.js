import { nextTick, debounce } from "./util";

const queue = [];     // 更新UI队列
var has = {},             // 队列中是否含有该Watcher
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
    queue.push(watcher);
    if (!waiting) {
        waiting = true;
        nextTick(flush);
    }
}
module.exports = pushWatcher;