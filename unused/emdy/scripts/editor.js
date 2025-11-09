const editor = document.getElementById("editor");

// text

editor.addLine = function (text) {
	let line = this.appendChild(document.createElement("div"));
	line.classList.add("line");
	line.append(text ? text : document.createElement("br"));
	return line;
}

editor.write = function (text) {
	this.textContent = "";
	for (const line of text.split("\n")) {
		let el = this.addLine(line);
		if (line) this.highlightLine(el);
	}
}

// highlighting

editor.regex = {
	prefix: {
		h: /^#+/,
		hr: /^[-*=]{2,}$/,
		ul: /^\t*[-*] /,
		ol: /^\t*\d\. /,
		quote: /^\t*>/,
	},
	infix: {
		asterisks: /\*+/,
		brackets: /[\[\]]/,
	},
}

editor.highlightLine = function (line) {
	let node = line.firstChild;
	// prefix
	if (!node.previousSibling) {
		for (const prefix in editor.regex.prefix) {
			let match = editor.regex.prefix[prefix].exec(node.data);
			if (match) {
				this.addHighlight(node, 0, match[0].length);
				line.classList.add("line-" + prefix);
				break;
			}
		}
	}
}

editor.clearHighlights = function (el) {
	for (const node of el.children) node.replaceWith(...node.childNodes);
	el.normalize();
	if (!el.textContent) el.appendChild(document.createElement("br"));
}

editor.addHighlight = function (before, start, length) {
	let inside = before.splitText(start);
	let after = inside.splitText(length);
	let span = document.createElement("span");
	span.classList.add("highlight");
	span.append(inside);
	before.after(span, after);
	return span;
}

editor.addEventListener("keyup", function (e) {
	if (e.key.length > 1 && e.key !== "Backspace") return;

	let line = this.getLine();
	let column = this.getColumn();

	for (let node = line.firstChild; node; node = node.nextSibling) {
		if (node instanceof Text) {
			for (const [key, regex] in Object.entries(editor.regex.infix)) {
				let idx = node.data.search(regex);
				if (idx !== -1) {
					let highlight = this.addHighlight();
					highlight.dataset.type = key;
					break;
				}
			}
		}
		else {
			if (!(editor.regex.infix[node.dataset.type] ?? editor.regex.prefix[node.dataset.type]).test(node.firstChild.data)) {
				node.replaceWith(node.firstChild);
			}
		}
	}

	this.clearHighlights(line);
	console.log(column);
	getSelection().setPosition(line.firstChild, column);
	this.highlightLine(line);
});

// cursor

editor.getLine = function () {
	let node = getSelection().focusNode;
	while (!node.classList?.contains("line")) node = node.parentElement;
	return node;
}

editor.getColumn = function () {
	let node = getSelection().focusNode;
	let column = getSelection().focusOffset;
	while (true) {
		if (node.previousSibling)
			node = node.previousSibling;
		else if (node.parentElement.classList.contains("highlight"))
			node = node.parentElement.previousSibling;
		else break;
		console.log("\t", node);
		column += node.length;
	}
	return column;
}

// setup

editor.addLine();