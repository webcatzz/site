// data

const tracks = {};

fetch("tunes.txt").then(async res => {
	for (const record of (await res.text()).split("\n\n")) {
		// data
		let track = Object.fromEntries(record.split("\n").map(field => field.split(": ")));
		if (track.tags) track.tags = track.tags.split(",");
		tracks[track.name] = track;
		// element
		let el = tracklist.appendChild(document.createElement("button"));
		el.classList.add("track");
		el.textContent = track.name;
		el.title = track.name;
		el.dataset.id = track.name;
		el.addEventListener("click", tracklist.onItemClicked);
	}
	rscroll.value = searchBar.offsetHeight / 2;
	rscroll.update();
	// url
	let id = new URLSearchParams(location.search).get("track");
	if (id) view.open(tracks[id]);
});

// list

const tracklist = document.getElementById("tracklist");

tracklist.onItemClicked = function () {
	view.open(tracks[this.dataset.id]);
}

// scroll

const rscroll = {
	value: 0,
	max: 0,

	scrollBy(delta) {
		this.scrollTo(this.value + delta);
	},
	
	scrollTo(value) {
		this.value = Math.min(Math.max(value, 0), this.max);
		this.update();
	},
	
	update() {
		let height = 0;
		for (const child of tracklist.children) {
			child.classList.remove("scroll-hidden");
			let rotation = (height + child.offsetHeight / 2 - this.value) / 2;
			height += child.offsetHeight;
			if (Math.abs(rotation) < 120)
				child.style.rotate = rotation + "deg";
			else child.classList.add("scroll-hidden");
		}
		this.max = height;
	},
}

tracklist.addEventListener("wheel", e => {
	rscroll.scrollBy(e.deltaY);
	e.preventDefault();
});

let touchY = 0, touchInitialScroll = 0;
tracklist.addEventListener("touchstart", e => {
	touchY = e.touches[0].pageY;
	touchInitialScroll = rscroll.value;
});
tracklist.addEventListener("touchmove", e => {
	rscroll.scrollTo(touchInitialScroll + (touchY - e.touches[0].pageY));
	e.preventDefault();
});

// search

const searchBar = document.getElementById("search");
searchBar.value = "";
searchBar.addEventListener("input", function () {
	let filters = this.value.split(" ").reduce((filters, query) => {
		if (query) filters.push(
			query.startsWith("tag:")
			? track => track.tags?.includes(query.substr(4))
			: query.startsWith("date:")
			? track => track.date?.includes(query.substr(5))
			: query.startsWith("note:")
			? track => track.note?.includes(query.substr(5))
			: track => track.name.includes(query)
		);
		return filters;
	}, []);
	for (const el of tracklist.getElementsByClassName("track"))
		el.classList.toggle("search-hidden", !filters.every(filter => filter(tracks[el.dataset.id])));
	rscroll.scrollTo(this.offsetHeight / 2);
});


// view

const view = document.getElementById("view");

view.open = function (track) {
	this.textContent = "";
	history.replaceState(null, "", "?track=" + track.name);

	let name = this.appendChild(document.createElement("h2"));
	name.id = "view-name";
	name.textContent = track.name;

	let embed = this.appendChild(document.createElement("iframe"));
	embed.id = "view-embed";
	embed.src = track.hash ? `https://${track.hash[0] === "u" ? "ultraabox.github.io" : "jummb.us"}/player/#song=${track.hash}` : track.link;

	let footer = this.appendChild(document.createElement("div"));
	footer.id = "view-footer";

	if (track.note) {
		let note = footer.appendChild(document.createElement("div"));
		note.id = "view-note";
		note.textContent = track.note;
	}

	if (track.tags) {
		let tags = footer.appendChild(document.createElement("div"));
		tags.id = "view-tags";
		for (const tag of track.tags) {
			let el = tags.appendChild(document.createElement("div"));
			el.textContent = tag;
		}
	}

	if (track.date) {
		let date = footer.appendChild(document.createElement("div"));
		date.id = "view-date";
		date.textContent = track.date;
	}

	this.animate({opacity: [0, 1]}, 50);
}