const XML = {};
XML.updateURL = false;



// fetching

XML.parser = new DOMParser;

XML.path = name => `_page/${name}.xml`;

XML.fetch = async name => {
	let root = XML.parser.parseFromString(await (await fetch(XML.path(name))).text(), "text/xml").documentElement;
	let page = {};
	for (const tag of root.children) {
		page[tag.tagName] = tag.innerHTML;
	}
	return page;
}



// dom

XML.template = page => "No template defined.";

XML.dom = async name => {
	let els;
	try {
		els = XML.parser.parseFromString(XML.template(await XML.fetch(name)), "text/html").body.children;
	}
	catch {
		els = [document.createElement("iframe")];
		els[0].src = XML.path(name);
	}
	return els;
}

XML.load = async (name, target) => {
	target.replaceChildren(...await XML.dom(name));
	if (XML.updateURL) {
		XML.params.set("page", name);
		history.replaceState(null, "", "?" + XML.params);
	}
}



// nav

XML.nav = async (target, buttons) => {
	for (const button of buttons) button.addEventListener("click", function () {
		XML.load(this.dataset.page, target);
		target.scrollTo(0, 0);
	});
	await XML.load(XML.params.get("page") ?? buttons[0].dataset.page, target);
	XML.updateURL = true;
}



// url

XML.params = new URLSearchParams(location.search);