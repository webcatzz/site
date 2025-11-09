// md

const md = {

	files: [],
	content: document.getElementById("content"),

	async load(path) {
		content.write(await (await fetch(path)).text());
	},

}

// nav

const nav = document.getElementById("nav");

nav.addFile = function (path) {
	let btn = this.appendChild(document.createElement("button"));
	btn.textContent = path;
	btn.addEventListener("click", () => md.load(path));
}

nav.addFolder = function (path) {
	// ...
}

nav.render = function () {
	this.addFile("test.md");
	this.addFile("test2.md");
}

nav.search = function (query) {
	// ...
}

nav.render();

// content

const content = document.getElementById("content");

content.regex = {
	h: /^\t*#+/,
	hr: /^\t*[-*=]{2,}$/,
	ul: /^\t*[-*] /,
	ol: /^\t*\d\. /,
	quote: /^\t*>/,
	img: /!\[.*\]\(.*\)/,
	b: /\*\*.*\*\*/,
	i: /\*.*\*/,
	a: /\[.*\]\(.*\)/,
	code: /`.*`/,
}

content.caret = getSelection();

content.caret.getLine = function () {
	let node = this.anchorNode;
	while (!node.classList?.contains("line")) {
		node = node.parentElement;
	}
	return node;
}

content.caret.getLineIdx = function () {
	let line = this.getLine();
	let idx = 0;
	while (line = line.previousElementSibling) idx++;
	return idx;
}

content.caret.getColumnIdx = function () {
	let node = this.anchorNode;
	let idx = this.anchorOffset;
	while (node) {
		if (node.previousSibling) {
			node = node.previousSibling;
			if (node instanceof Element) node = node.lastChild;
		}
		else if (!node.parentElement.classList.contains("line")) {
			node = node.parentElement;
		}
		else break;
		idx += node.length;
	}
	return idx;
}

content.caret.moveTo = function (y, x) {
	let node = content.children[y].firstChild;
	while (true) {
		if (node.length >= x) {
			this.setPosition(node, x);
			break;
		}
		else if (node.nextSibling) {
			node = node.nextSibling;
			if (node instanceof Element) node = node.firstChild;
		}
		else node = node.parentElement.nextSibling;
	}
}

content.write = function (text) {
	this.replaceChildren(...text.split("\n").map(line => {
		let el = this.appendChild(document.createElement("div"));
		el.classList.add("line");
		el.append(...parser.handleLine(line));
		return el;
	}));
}

content.handleLine = function (text) {
	

}

content.highlightLine = function (line) {
	let text = line.textContent;
	let nodes = [], i;

	line.replaceChildren(...nodes);
}

content.highlight = function (node) {
	let el = document.createElement("span");
	el.classList.add("accent");
	el.append(node);
	return el;
}

content.addEventListener("keyup", function (e) {
	let line = this.caret.getLineIdx();
	let column = this.caret.getColumnIdx();
	this.highlightLine(this.caret.getLine());
	this.caret.moveTo(line, column);
});



/*

block
	# heading
	1. ordered list
	- unordered list
	> blockquote

inline
	**bold**, *italic*, `code`
	[link](url)
	![alt](url)

misc
	--- (horizontal rule)

*/

// parser

const parser = {}

parser.tokens = [
	/^\t*#+ /y, // h
	/^\t*[-*=]{2,}$/y, // hr
	/^\t*[-*] /y, // ul
	/^\t*\d\. /y, // ol
	/^\t*>/y, // quote
	/!\[.*\]\(.*\)/y, // img
	/\*\*.*\*\*/y, // b
	/\*.*\*/y, // i
	/\[.*\]\(.*\)/y, // a
	/`.*`/y, // code
]

parser.handleLine = function (text) {
	console.log(text);
	
	for (const token of this.tokens) {
		if (token.test(text)) {
			let start = text.search(token);
			let end = token.lastIndex;
			return [this.highlight(text.substring(start, end)), text.substring(end)];
		}
	}
	return [text ? text : document.createElement("br")];
}

parser.highlight = function (text) {
	let el = document.createElement("span");
	el.classList.add("highlight");
	el.textContent = text;
	return el;
}

parser.highlightAll = (text, start, end) => [highlight(text.substring(start, end))];
parser.highlightPrefix = (text, start, end) => [highlight(text.substring(start, end)), text.substring(end)];

// test

md.load("test.md");