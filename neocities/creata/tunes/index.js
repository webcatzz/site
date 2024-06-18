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
		if (!this.checked) for (const button of this.parentElement.querySelectorAll("& > radio-button")) {
			if (button.checked) {
				button.checked = false;
				break;
			}
		}

		this.checked = !this.checked;
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

	button.addEventListener("click", function () {
		view(this.checked ? null : track);
	});
	document.getElementById("tracklist").appendChild(button);
}



// filtering

for (const button of document.querySelectorAll("#filters radio-button")) button.addEventListener("click", filterbuttonclick);
function filterbuttonclick() {
	if (this.checked) filterBy(this.dataset.value ?? this.getAttribute("aria-label"));
	else filterBy("track");
};

function filterBy(query) {
	for (const track of document.getElementsByClassName("track")) {
		track.classList.contains(query) ? track.classList.remove("hidden") : track.classList.add("hidden");
	}
}



// viewing track

const viewdiv = {
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
		let rand = Math.floor(Math.random() * (viewdiv.colors.length - 1));
		if (rand === viewdiv.prevColor) rand++;
		viewdiv.el.style.setProperty("--color", viewdiv.colors[rand]);
		viewdiv.prevColor = rand;
	}
}

function view(track) {
	if (track) viewdiv.el.classList.remove("hidden");
	else return viewdiv.el.classList.add("hidden");

	viewdiv.randomizeColor();
	viewdiv.title.textContent = track.name;
	viewdiv.iframe.src = "";
	if (track.hash) setTimeout(() => viewdiv.iframe.src = hashToURL(track.hash), 120);
	
	else setTimeout(() => viewdiv.iframe.src = "https://file.garden/ZdmFgugxzVCR-8Bl/tunes/" + encodeURIComponent(track.name) + ".mp3", 50);
	if (track.note) {
		viewdiv.description.textContent = track.note;
		viewdiv.description.classList.remove("hidden");
	}
	else viewdiv.description.classList.add("hidden");

	if (track.tags) {
		viewdiv.tags.textContent = "";
		for (const tag of track.tags) {
			let el = viewdiv.tags.appendChild(document.createElement("span"));
			el.className = "tag";
			el.textContent = tag;
		}
		viewdiv.tags.classList.remove("hidden");
	}
	else viewdiv.tags.classList.add("hidden");
}

view(null);