// buttons

class RadioButton extends HTMLElement {

	#checked = false;
	get checked() {return this.#checked}
	set checked(value) {
		this.#checked = value;
		this.ariaChecked = value;
	}

	connectedCallback() {
		this.role = "radio";
		this.tabIndex = 0;
		this.addEventListener("click", this.toggle);
	}

	toggle() {
		if (!this.checked) {
			for (const button of document.querySelectorAll(this.tagName)) {
				if (button.checked) {
					button.checked = false;
					break;
				}
			}
		}
		this.checked = !this.checked;
	}

}



// filtering

class FilterButton extends RadioButton {

	toggle() {
		super.toggle();

		if (this.checked) {
			params.setAndUpdate("filter", this.getAttribute("value"));
			let filter = this.getAttribute("value").replaceAll(" ", "-");
			for (const track of document.getElementsByTagName("track-btn")) {
				track.classList.toggle("hidden", !track.classList.contains(filter));
			}
		}
		else {
			params.deleteAndUpdate("filter");
			for (const track of document.getElementsByTagName("track-btn")) {
				track.classList.remove("hidden");
			}
		}

	}

}



// tracks

class TrackButton extends RadioButton {

	connectedCallback() {
		super.connectedCallback();
	
		let name = this.appendChild(document.createElement("div"));
		name.textContent = this.getAttribute("name");
		name.className = "track-name";

		if (this.hasAttribute("date")) {
			let date = this.appendChild(document.createElement("time"));
			date.dateTime = this.getAttribute("date");
			date.textContent = new Date(date.dateTime).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}).toLowerCase();
		}

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
	
		let icons = this.appendChild(document.createElement("div"));
		icons.className = "track-icons";
		if (this.classList.contains("complete")) {
			let icon = icons.appendChild(document.createElement("img"));
			icon.title = "complete";
			icon.src = "_assets/complete.png";
		}
		if (this.classList.contains("starred")) {
			let icon = icons.appendChild(document.createElement("img"));
			icon.title = "starred";
			icon.src = "_assets/starred.png";
		}
	}

	toggle() {
		super.toggle();
		panel.view(this.checked ? this : null);
	}

}



// panel

const panel = Object.assign(document.getElementById("panel"), {

	header: document.querySelector("#panel h2"),
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

	recolor: () => {
		let rand = Math.floor(Math.random() * (panel.colors.length - 1));
		if (rand === panel.prevColor) rand++;
		panel.style.setProperty("--color", panel.colors[rand]);
		panel.prevColor = rand;
	},

	view: track => {
		if (track) {
			params.setAndUpdate("track", track.getAttribute("name"));
			panel.hidden = false;
		}
		else {
			params.deleteAndUpdate("track");
			panel.iframe.src = "";
			panel.hidden = true;
			return;
		}
		
		// title
		panel.header.textContent = track.getAttribute("name");
		
		// iframe
		let iframe = document.createElement("iframe");
		iframe.src = track.getAttribute("link");
		panel.iframe.replaceWith(iframe);
		panel.iframe = iframe;
		panel.recolor();
	
		// note
		if (track.hasAttribute("note")) {
			panel.description.textContent = track.getAttribute("note");
			panel.description.hidden = false;
		}
		else panel.description.hidden = true;
	
		// tags
		if (track.classList) {
			panel.tags.textContent = "";
			for (const tag of track.classList) {
				let el = panel.tags.appendChild(document.createElement("span"));
				el.textContent = tag;
				el.className = "track-tag";
			}
			panel.tags.classList.hidden = false;
		}
		else panel.tags.classList.hidden = true;
	},

});



// definitions

customElements.define("filter-btn", FilterButton);
customElements.define("track-btn", TrackButton);



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
	let button = document.getElementsByTagName("track-btn").namedItem(params.get("track"));
	if (button) {
		button.scrollIntoView({behavior: "smooth", block: "center"});
		button.click();
	}
}

if (params.has("filter")) {
	for (const button of document.getElementsByTagName("filter-btn")) {
		if (button.getAttribute("value") === params.get("filter")) {
			button.click();
			break;
		}
	}
}