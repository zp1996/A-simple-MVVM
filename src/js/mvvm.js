import observer from "./observer";
import compile from "./compile";
import {
    isFunction, 
    copy, 
    replace,
    nextTick
} from "./util";
/*
 * 每一个用到响应式的数据对应一个Dep,数据更改时,会触发setter
 * 会调用出来与这个Dep相关联的watcher来决定是否变化watcher相对应
 * 的dom,每一个与数据相关联的dom节点对应着一个watcher,整个的关联
 * 关系是在运行时决定的,也就是需要将模板html解析,从而得出关联关系
 */
class MVVM {
    constructor(opts) {
        this.$options = opts;
        this.el = opts.el;
        var data = this._data = isFunction(opts.data) ? 
            opts.data() : copy(opts.data);
        // vm._data.x => vm.x,方便外界访问
        const keys = Object.keys(data);
        var i = keys.length;
        while (i--) {
            // Vue在此处还考虑到了是否在props是否有该属性
            this._proxy(keys[i]);
        }
        // 将数据全部转换为getter/setter形式
        observer(data);
        // 对模板进行编译
        this._compile();
    }
    _proxy(key) {
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => {
                return this._data[key];
            },
            set: (val) => {
                this._data[key] = val;
            }
        });
    }
    $nextTick(cb) {
        nextTick(cb, this);
    }
    _compile() {
        this.el = document.querySelector(this.el);
        replace(this.el, compile(this.el, this));
    }
}

window.Mvvm = MVVM;