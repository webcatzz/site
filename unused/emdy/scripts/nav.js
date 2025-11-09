const nav = document.getElementById("nav");

nav.addFile = function (path) {


	let item = this.getItem(path.substring(0, path.lastIndexOf("/"))) ?? this;
	let btn = item.appendChild(document.createElement("button"));
	btn.dataset.name = path.substring(path.lastIndexOf("/") + 1, path.length);
	btn.textContent = path;
	btn.addEventListener("click", () => emdy.load(path));
}

nav.addFolder = function (path) {
	let folder = this.appendChild(document.createElement("details"));
}

nav.getItem = function (path) {
	let item = this;
	for (const part of path.split("/")) {
		for (const child of item.children) {
			if (child.dataset.name == part) {
				item = child;
				break;
			}
		}
	}
	return item;
}

// active item

nav.setActive = function (item) {
	for (const item of nav.getElementsByClassName("active")) item.classList.remove("active");
	item.classList.add("active");
}