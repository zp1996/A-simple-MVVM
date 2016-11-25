const dirRE = /^v-(.*)$/,
	eventRE = /^v-on:(.*)$/,
	vhtml = "v-html",
	vtext = "v-text",
	vmodel = {
		INPUT: true,
		TEXTAREA: true
	};
// 更新集合
const updateCollection = {
	text: (ele, value) => {
		ele.textContent = value == null ? "" : value;
	},
	html: (ele, value) => {
		ele.innerHTML = value == null ? "" : value;
	},
	model: (ele, value) => {
		ele.value = value == null ? "" : value;
	}
};
// 指定集合
const dirCollection = {
	text: (node, vm, path) => {
		BaseDir(node, vm, path, "text");
	},
	html: (node, vm, path) => {
		BaseDir(node, vm, path, "html");
	},
	model: (node, vm, path) => {
		if (vmodel[node.tagName]) {
			BaseDir(node, vm, path, "model");
		} else {
			throw new Error("v-model just can use in input or textarea");
		}
	}
};

function compile(el, vm) {
	var flag = false;
	el = el.cloneNode(true);
	const attrs = Array.prototype.slice.call(el.attributes);
	attrs.forEach((val) => {
		const name = val.name,
			value = val.value;
		if (dirRE.test(name)) {
			var dir;
			// 事件指令
			if (
				(dir = name.match(eventRE)) && 
				(dir = dir[1])
			) {
				
			} else {
				dir = name.match(dirRE)[1];
				dirCollection[dir](el, vm, value);
			}
			// 指令中为v-html or v-text终止递归
			flag = flag || 
				name === vhtml || 
				name === vtext;	
			el.removeAttribute(name);
		}	
	});
	if (!flag) {
		const fragment = document.createDocumentFragment();
		var child;
		while (child = el.firstChild) {
			fragment.appendChild(child);
		}
	}
	return el;
}
function compileNode(node) {

}
function getValue(vm, path) {
	var val = vm;
	path = path.split(".");
	path.forEach((key) => {
		val = val[key];
	});
	return val;
}
function BaseDir(node, vm, path, dir) {
	const fn = updateCollection[dir];
	fn && fn(node, getValue(vm, path));
}
module.exports = compile;