// radial scroll

const index = document.getElementById("index");
const scrollItems = index.querySelectorAll("#search, a, .index-year");

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

index.addEventListener("wheel", e => {
	rscroll.scrollBy(e.deltaY);
	e.preventDefault();
});

index.addEventListener("touchstart", e => {
	touchY = e.touches[0].pageY;
	touchInitialScroll = rscroll.value;
});

index.addEventListener("touchmove", e => {
	rscroll.scrollTo(touchInitialScroll + (touchY - e.touches[0].pageY));
	e.preventDefault();
});

// search

const searchBar = document.getElementById("search");
const links = index.getElementsByTagName("a");
searchBar.value = new URLSearchParams(location.search).get("search") ?? "";

function search() {
	let filters = searchBar.value.split(" ").map(query => {
		let [type, text] = query.split(":", 2);
		if (!text) return link => link.textContent.includes(type);
		else return link => link.dataset[type]?.includes(text);
	});
	for (const link of links)
		link.classList.toggle("search-hidden", !filters.every(filter => filter(link)));
	rscroll.scrollTo(0);
}

searchBar.addEventListener("input", search);
if (searchBar.value) search();