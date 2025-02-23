// buttons

class ToggleButton extends HTMLElement {
	#checked = false;
	get checked() {return this.#checked}
	set checked(value) {
		this.#checked = value;
		this.classList.toggle("active", value);
		this.ariaChecked = value;
	}

	constructor() {
		super();
		this.tabIndex = 0;
		this.addEventListener("click", this.toggle);
	}

	toggle() {
		this.checked = !this.checked;
	}
}



// tracklist

const tracks = document.getElementById("tracklist").children;

class Track extends ToggleButton {
	tags = [];

	constructor() {
		super();
		this.role = "radio";

		// tags
		if (this.hasAttribute("tags")) this.tags = this.getAttribute("tags").split(",");

		// content
		this.innerHTML = `
			<img class="track-disc" style="--size: ${Math.random() * 75 + 75}px; rotate: ${Math.random() * 360}deg">
			<div class="track-header">
				<div class="track-name">${this.getAttribute("name")}</div>
				${this.hasAttribute("date") ? `<time class="track-date" datetime="${this.getAttribute("date")}">${new Date(this.getAttribute("date")).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}).toLowerCase()}</time>` : ""}
			</div>
			<div class="track-tags">
				${this.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("")}
			</div>
		`;

		// hash
		if (this.hasAttribute("hash")) {
			let host;
			switch (this.getAttribute("hash")[0]) {
				case "u": host = "ultraabox.github.io"; break;
				case "j": host = "jummb.us"; break;
				default: host = "www.beepbox.co";
			}
			this.setAttribute("link", `https://${host}/player/#song=${this.getAttribute("hash")}`);
			this.removeAttribute("hash");
		}
	}

	toggle() {
		if (!this.checked) {
			for (const track of tracks) {
				if (track.checked) {
					track.checked = false;
					break;
				}
			}
		}
		super.toggle();
		view.open(this.checked ? this : null);
	}

}
customElements.define("c-track", Track);



// filtering

var filters = [];
const tagCounts = {};

function addFilter(tag) {
	filters.push(tag);
	filter();
}

function removeFilter(tag) {
	filters.splice(filters.indexOf(tag), 1);
	filter();
}

function filter() {
	for (const track of tracks) {
		let failed = false;
		for (const tag of filters) if (!track.tags.includes(tag)) {
			failed = true;
			break;
		}
		track.classList.toggle("hidden", failed);
	}

	filters.length ? params.setAndUpdate("filter", filters) : params.deleteAndUpdate("filter");
}

class Filter extends ToggleButton {
	constructor() {
		super();
		this.role = "checkbox";
	}

	toggle() {
		super.toggle();
		this.checked ? addFilter(this.textContent) : removeFilter(this.textContent);
	}
}
customElements.define("c-filter", Filter);



// ordering filters

const filterEl = document.getElementById("filters");

for (const track of tracks) {
	for (const tag of track.tags) {
		if (tagCounts[tag]) tagCounts[tag] += 1;
		else tagCounts[tag] = 1;
	}
}

for (const filter of document.getElementsByTagName("c-filter")) {
	filter.style.setProperty("--count", "\"" + tagCounts[filter.textContent] + "\"");
}



// view

const view = Object.assign(document.getElementById("view"), {

	header: document.getElementById("view-name"),
	iframe: document.querySelector("iframe"),
	note: document.getElementById("view-note"),
	tags: document.getElementById("view-tags"),

	open: track => {
		if (track) {
			params.setAndUpdate("track", track.getAttribute("name"));
			view.hidden = false;
		}
		else {
			params.deleteAndUpdate("track");
			view.iframe.src = "";
			view.hidden = true;
			return;
		}
		
		// title
		view.header.textContent = track.getAttribute("name");
		
		// iframe
		let iframe = document.createElement("iframe");
		iframe.src = track.getAttribute("link");
		view.iframe.replaceWith(iframe);
		view.iframe = iframe;
	
		// note
		if (track.hasAttribute("note")) {
			let note = document.createElement("div");
			note.textContent = track.getAttribute("note");
			note.className = "note";
			view.note.replaceChildren(note);
		} else view.note.innerHTML = "<div class=\"view-empty\">-</div>";
	
		// tags
		view.tags.innerHTML = track.tags.length ? track.tags.map(tag => {return `<div class="tag">${tag}</div>`}).join("") : "<div class=\"view-empty\">-</div>";
	},

});



// url params

const params = new URLSearchParams(location.search);
params.url = new URL(location);

params.setAndUpdate = function (key, value) {
	this.set(key, value);
	this.update();
}

params.deleteAndUpdate = function (key) {
	this.delete(key);
	this.update();
}

params.update = function () {
	this.url.search = this;
	history.replaceState(null, "", this.url);
}



// page load

if (params.has("track")) {
	let button = tracks[params.get("track")];
	if (button) {
		button.scrollIntoView({behavior: "smooth", block: "center"});
		button.click();
	}
}

if (params.has("filter")) {
	for (const tag of params.get("filter").split(",")) {
		addFilter(tag);
	}
	for (const filter of document.getElementsByTagName("c-filter")) {
		filter.checked = filters.includes(filter.textContent);
	}
}