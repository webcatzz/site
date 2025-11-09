// setup

function span(text, ...classList) {
	let el = document.createElement("span");
	el.textContent = text;
	el.classList.add(...classList);
	return el;
}

for (const heading of document.querySelectorAll("h2, h3, h4, h5, h6")) {
	heading.addEventListener("click", () => collapse(heading));
}

for (const term of document.getElementsByClassName("func")) {
	let text = term.textContent, i = 0;
	let name = text.substring(i, i = text.indexOf("(", i));
	let params = text.substring(++i, i = text.indexOf(")", i)).split(",");
	term.id = name;
	term.replaceChildren(
		span(name, "func-name"),
		"(",
		...params.flatMap((param, i) => i == params.length - 1 ? span(param, "func-param") : [span(param, "func-param"), ","]),
		")"
	);
}

// collapsing

let allCollapsed = false;

function collapse(h, collapsed) {
	collapsed = h.classList.toggle("collapsed", collapsed);
	let level = h.localName[1];
	for (let n = h.nextElementSibling; n; n = n.nextElementSibling) {
		if (isHeading(n)) {
			if (n.localName[1] > level) {
				if (!collapsed && n.classList.contains("collapsed")) {
					n.classList.remove("hidden");
					while (n.nextElementSibling && !isHeading(n.nextElementSibling)) n = n.nextElementSibling;
					continue;
				}
			}
			else break;
		}
		n.classList.toggle("hidden", collapsed);
	}

	function isHeading(n) {
		return n.localName[0] == "h" && n.localName.length == 2;
	}
}

function collapseAll(value = true) {
	allCollapsed = value;
	for (const heading of document.querySelectorAll("h2, h3, h4, h5, h6")) {
		collapse(heading, allCollapsed);
	}
}

document.getElementById("collapse-all").addEventListener("click", function () {
	collapseAll(!allCollapsed);
	this.textContent = allCollapsed ? "…" : "☉";
});