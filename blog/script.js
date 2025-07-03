// nav

const nav = document.querySelector("nav");

nav.getChildById = function (id) {
	for (const child of this.children)
		if (child.dataset.id === id)
			return child;
	return null;
}

nav.onChildClicked = function () {
	entry.loadAndRecord(this.dataset.id);
}

for (const child of nav.children) {
	child.title = child.textContent;
	child.addEventListener("click", nav.onChildClicked);
}

// nav scroll

nav.updateScroll = function () {
	for (const child of this.children) {
		let percent = Math.min(1, Math.max(0, (child.offsetTop + child.offsetHeight / 2 - this.offsetTop - this.scrollTop) / this.offsetHeight));
		child.style.marginLeft = percent * 185 - 24 + "px";
		if (percent == 1) break;
	}
}

nav.addEventListener("scroll", nav.updateScroll);
nav.updateScroll();

// nav search

nav.search = function (query = "") {
	for (const child of this.children) {
		child.hidden = !child.textContent.includes(query);
	}
	this.updateScroll();
}

const searchBar = document.getElementById("search");
searchBar.value = "";
searchBar.addEventListener("input", () => nav.search(searchBar.value));

// entry

const entry = document.getElementById("entry");

entry.load = async function (page) {
	let xml = await XML.fetch(`pages/${page}.xml`);
	this.textContent = "";
	this.scroll(0, 0);

	let header = this.appendChild(document.createElement("hgroup"));
	header.id = "entry-header";

	let title = header.appendChild(document.createElement("h2"));
	title.id = "entry-title";
	title.textContent = xml.get("name").text;

	if (xml.get("date")) {
		let date = header.appendChild(document.createElement("p"));
		date.id = "entry-date";
		date.textContent = xml.get("date").text;
	}

	let content = this.appendChild(document.createElement("main"));
	content.id = "entry-content";
	content.innerHTML = xml.get("content").text;

	let footer = this.appendChild(document.createElement("footer"));
	footer.id = "entry-footer";

	let navItem = nav.getChildById(page);

	if (navItem.previousElementSibling) {
		let prevBtn = footer.appendChild(document.createElement("button"));
		prevBtn.id = "entry-prev";
		prevBtn.classList.add("entry-chain-link");
		prevBtn.textContent = "← prev";
		prevBtn.addEventListener("click", () => entry.loadAndRecord(navItem.previousElementSibling.dataset.id));
	}

	if (navItem.nextElementSibling) {
		let nextBtn = footer.appendChild(document.createElement("button"));
		nextBtn.id = "entry-next";
		nextBtn.classList.add("entry-chain-link");
		nextBtn.textContent = "next →";
		nextBtn.addEventListener("click", () => entry.loadAndRecord(navItem.nextElementSibling.dataset.id));
	}
	
	this.animate({opacity: [0, 1]}, 50);
}

entry.loadAndRecord = function (page) {
	entry.load(page);
	history.replaceState(null, "", "?page=" + page);
}

// url params

let page = new URLSearchParams(location.search).get("page");
entry.load(page ?? nav.firstElementChild.dataset.id);