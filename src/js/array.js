// 数组的变化不能利用简单的 === 来判断
// 引用没变不能触发setter更新,解决办法就是重载数组的变化方法
import { def } from './util';

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto); 

// 注意的是sort,splice,reverse改变的全部是原数组
['push', 'pop', 'shift', 'unshift', 
 'splice', 'sort', 'reverse'].forEach((method) => {
 	const original = arrayProto[method];
 	// 重载数组的方法
 	def(arrayMethods, method, function() {
 		let i = arguments.length;
 		const args = new Array(i);
 		while(i--) {
 			args[i] = arguments[i];
 		}
 		const result = original.apply(this, args);
 		const ob = this.__ob__;
 		let inserted;
 		switch(method) {
 			case 'push':
 			case 'unshift':
 				inserted = args;
 				break;
 			case 'splice':
 				// 获取到加入的元素
 				inserted = args.slice(2);
 				break;
 		}
 		if (inserted) ob.observerArray(inserted);

 		// 通知更新变化 
 		ob.dep.notify();
 		return result;
 	});	
});