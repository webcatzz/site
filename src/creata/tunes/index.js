// buttons

class RadioButton extends HTMLElement {

	connectedCallback() {
		this.role = "radio";
		this.checked = false;
		this.tabIndex = 0;

		this.classList.add("button");

		this.addEventListener("click", this.toggle);
	}

	#checked = false;
	get checked() {return this.#checked}
	set checked(value) {
		this.#checked = value;
		this.ariaChecked = value;
	}

	toggle() {
		if (!this.checked) {
			for (const button of this.parentElement.querySelectorAll("& > radio-button")) {
				if (button.checked) {
					button.checked = false;
					break;
				}
			}
		}
		this.checked = !this.checked;
		this.dispatchEvent(new Event("toggle"));
	}

}

customElements.define("radio-button", RadioButton);



// creating tracklist

for (const track of tracklist) {
	let button = document.createElement("radio-button");
	button.classList.add("track");

	// name
	let name = button.appendChild(document.createElement("div"));
	name.className = "track-name";
	name.textContent = track.name;

	// date
	if (track.date) {
		let date = new Date(...track.date.toReversed());
		let el = button.appendChild(document.createElement("time"));
		el.dateTime = [date.getFullYear(), date.getMonth(), date.getDate()].join("-");
		el.textContent = date.toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}).toLowerCase();
	}

	// tags
	if (track.tags) {
		button.classList.add(...track.tags);

		let icons = [];
		if (track.tags.includes("complete")) icons.push("complete");
		if (track.tags.includes("starred")) icons.push("starred");
		if (icons) {
			let el = button.appendChild(document.createElement("div"));
			el.className = "track-icons";
			for (const icon of icons) {
				let iconEl = el.appendChild(document.createElement("img"));
				iconEl.src = "_assets/" + icon + ".png";
				iconEl.title = icon;
			}
		}
	}

	// updating view
	button.addEventListener("toggle", function () {
		viewTrack(this.checked ? track : null);
	});

	document.getElementById("tracklist").appendChild(button);
}



// filtering

for (const button of document.querySelectorAll("#filters radio-button")) {
	button.addEventListener("toggle", onFilterToggle);
}

function onFilterToggle() {
	filterBy(this.checked ? this.dataset.value ?? this.getAttribute("aria-label") : "track");
}

function filterBy(query) {
	for (const track of document.getElementsByClassName("track")) {
		track.classList.contains(query) ? track.classList.remove("hidden") : track.classList.add("hidden");
	}
}



// viewing track

const view = {
	el: document.getElementById("view"),
	title: document.querySelector("h2"),
	ribbon: document.getElementById("ribbon"),
	iframe: document.querySelector("iframe"),
	description: document.getElementById("description"),
	tags: document.getElementById("tags"),

	colors: [
		"#ef0c8f", // red
		"#f59b1b", // orange
		"#f1e729", // yellow
		"#53d972", // green
		"#02d1f5", // blue
		"#4e0ba1", // purple
	],

	prevColor: -1,
	randomizeColor: () => {
		let rand = Math.floor(Math.random() * (view.colors.length - 1));
		if (rand === view.prevColor) rand++;
		view.el.style.setProperty("--color", view.colors[rand]);
		view.prevColor = rand;
	}
}

function viewTrack(track) {
	if (track) view.el.classList.remove("hidden");
	else return view.el.classList.add("hidden");

	view.randomizeColor();

	// title
	history.replaceState(null, "", "?track=" + track.name);
	view.title.textContent = track.name;

	// iframe
	let newFrame = document.createElement("iframe");
	newFrame.src = track.hash ? hashToURL(track.hash) : "https://file.garden/ZdmFgugxzVCR-8Bl/site/tunes/" + encodeURIComponent(track.name) + ".mp3";
	view.iframe.replaceWith(newFrame);
	view.iframe = newFrame;

	// note
	if (track.note) {
		view.description.textContent = track.note;
		view.description.classList.remove("hidden");
	}
	else view.description.classList.add("hidden");

	// tags
	if (track.tags) {
		view.tags.textContent = "";
		for (const tag of track.tags) {
			let el = view.tags.appendChild(document.createElement("span"));
			el.className = "tag";
			el.textContent = tag;
		}
		view.tags.classList.remove("hidden");
	}
	else view.tags.classList.add("hidden");
}

viewTrack(null);



// url params

let params = new URLSearchParams(location.search);

if (params.has("track")) {
	let idx = tracklist.findIndex(track => track.name === params.get("track"));

	if (idx !== -1) {
		let button = document.getElementsByClassName("track")[idx];
		button.scrollIntoView({behavior: "smooth", block: "center"});
		button.click();
	}
}