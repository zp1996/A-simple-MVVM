import Watcher from "./watcher";
import {
	isScript, 
	replace,
	getValue,
	setValue,
	nextTick,
	insertBefore
} from "./util";

const dirRE = /^v-(.*)$/,
	eventRE = /^v-on:(.*)$/,
	tagRE = /\{\{\{(.*?)\}\}\}|\{\{(.*?)\}\}/g,
	htmlRE = /^\{\{\{(.*)\}\}\}$/,
	vhtml = "v-html",
	vtext = "v-text",
	vmodel = {
		INPUT: true,
		TEXTAREA: true
	},
	cacheDiv = document.createElement("div");
// 更新集合
const updateCollection = {
	text: (ele, value) => {
		ele.textContent = value == null ? "" : value;
	},
	html: (ele, value, parent) => {
		console.log(ele, parent);
		if (!parent) {
			ele.innerHTML = value;
		} else {
			// 解析插值html
			cacheDiv.innerHTML = value;
			const childs = cacheDiv.childNodes;
			if (ele.childNodes.length) {
				const first = ele.firstChild;
				console.log(first);
				for (let child of childs) {
					insertBefore(child, first);
				}
			} else {
				for (let child of childs) {
					ele.appendChild(child);
				}
			}
		}
	},
	model: (ele, value, vm, path) => {
		// 视图->模型，不用设置value值
		if (ele.value !== value)
			ele.value = value == null ? "" : value;
		ele.addEventListener("input", (e) => {
			var newValue = e.target.value;
			if (value === newValue) {
				return void 0;
			}
			value = newValue;
			nextTick(() => {
				setValue(vm, path, newValue);
			});
		}, false);
	}
};
// 指定集合
const dirCollection = {
	text: (node, vm, path) => {
		BaseDir(node, vm, path, "text");
	},
	html: (node, vm, path, parent) => {
		BaseDir(node, vm, path, "html", parent);
	},
	model: (node, vm, path) => {
		if (vmodel[node.tagName]) {
			BaseDir(node, vm, path, "model");
		} else {
			throw new Error("v-model just can use in input or textarea");
		}
	},
	eventDir: (node, type, vm, fn) => {
		const method = vm.$options.methods && vm.$options.methods[fn];
		if (method) {
			node.addEventListener(type, method.bind(vm), false);
		}
	}
};

function compile(el, vm) {
	el = el.cloneNode(true);
	compileNode(el, vm);
	return el;
}
function compileNode(node, vm) {
	const type = node.nodeType;
	if (type === 1 && !isScript(node)) {
		compileElement(node, vm);
	} else if (type === 3 && node.data.trim()) {
		compileTextNode(node, vm);
	} else {
		return null;
	}
}
function compileNodeList(nodes, vm) {
	for (let val of nodes) {
		compileNode(val, vm);
	}
}
function compileElement(node, vm) {
	var flag = false;
	const attrs = Array.prototype.slice.call(node.attributes);
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
				dirCollection["eventDir"](node, dir, vm, value);
			} else {
				dir = name.match(dirRE)[1];
				dirCollection[dir](node, vm, value);
			}
			// 指令中为v-html or v-text or v-model终止递归
			flag = flag || 
				name === vhtml || 
				name === vtext;	
			node.removeAttribute(name);
		}	
	});
	const childs = node.childNodes;
	if (!flag && childs && childs.length) {
		compileNodeList(childs, vm);
	}
}
function compileTextNode(node, vm) {
	const tokens = parseText(node);
	if (tokens == null) return void 0;
	var frag = document.createDocumentFragment();
	tokens.forEach(token => {
		var el;
		if (token.tag) {
			if (token.html) {
				el = document.createDocumentFragment();
				dirCollection["html"](el, vm, token.value, node.parentNode);
			} else {
				el = document.createTextNode(" ");
				dirCollection["text"](el, vm, token.value);
			}
		} else {
			el = document.createTextNode(token.value);
		} 
		el && frag.appendChild(el);
	});
	return replace(node, frag);
}
function parseText(node) {
	var text = node.wholeText;
	if (!tagRE.test(text)) {
		return void 0;
	}
	const tokens = [];
	var lastIndex = tagRE.lastIndex = 0,
		match, index, html, value;
	while (match = tagRE.exec(text)) {
		index = match.index;
		if (index > lastIndex) {
			tokens.push({
				value: text.slice(lastIndex, index)
			})
		}
		html = htmlRE.test(match[0]);
		value = html ? match[1] : match[2];
		tokens.push({
			value: value,
			tag: true,
			html: html
		});
		lastIndex = index + match[0].length;
	}
	if (lastIndex < text.length) {
		tokens.push({
			value: text.slice(lastIndex)
		})
	}
	return tokens;
}
function BaseDir(node, vm, path, dir, parent) {
	const fn = updateCollection[dir];
	fn && fn(node, getValue(vm, path), vm, path);
	console.log(dir, parent);
	if (dir === "html") {
		new Watcher(vm, path, (value) => {
			fn && fn(node, value, parent);
		});
	} else {
		new Watcher(vm, path, (value) => {
			fn && fn(node, value, vm, path);
		});
	}
}
module.exports = compile;