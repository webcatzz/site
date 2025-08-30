// scroll

const list = document.getElementById("list");
const scrollItems = list.querySelectorAll("#search, a");

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
		for (const item of scrollItems) {
			item.classList.remove("scroll-hidden");
			let rotation = (height + item.offsetHeight / 2 - this.value) / 2;
			height += item.offsetHeight;
			if (Math.abs(rotation) > 135) item.classList.add("scroll-hidden");
			else {
				item.style.rotate = rotation + "deg";
				item.style.opacity = 1.0 - (Math.abs(rotation) - 90) / 45;
			}
		}
		this.max = height;
	},
};

rscroll.update();

let touchY = 0, touchInitialScroll = 0;

list.addEventListener("wheel", e => {
	rscroll.scrollBy(e.deltaY);
	e.preventDefault();
});

list.addEventListener("touchstart", e => {
	touchY = e.touches[0].pageY;
	touchInitialScroll = rscroll.value;
});

list.addEventListener("touchmove", e => {
	rscroll.scrollTo(touchInitialScroll + (touchY - e.touches[0].pageY));
	e.preventDefault();
});

// search

const searchBar = document.getElementById("search");
const links = document.querySelectorAll("#list a");
const tracks = document.querySelectorAll("#tracks article");
searchBar.value = "";

searchBar.addEventListener("input", function () {
	let filters = this.value.split(" ").map(query => {
		let [type, text] = query.split("=", 2);
		let selector = "h2";
		if (!text) text = type;
		else if (type == "tag") selector = ".track-tags";
		else if (type == "date") selector = ".track-date";
		else if (type == "note") selector = ".track-note";
		text = text.replaceAll("_", " ");
		return track => track.querySelector(selector).textContent.includes(text);
	});
	for (let i = 0; i < tracks.length; i++)
		links[i].classList.toggle("search-hidden", !filters.every(filter => filter(tracks[i])));
	rscroll.scrollTo(0);
});