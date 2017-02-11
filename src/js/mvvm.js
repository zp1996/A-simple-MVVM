import observer from "./observer";
import compile from "./compile";
import {
	isFunction, 
	copy, 
	replace,
	nextTick
} from "./util";

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
		console.log(cb);
		nextTick(cb, this);
	}
	_compile() {
		this.el = document.querySelector(this.el);
		replace(this.el, compile(this.el, this));
	}
}

window.Mvvm = MVVM;