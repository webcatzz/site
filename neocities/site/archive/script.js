const history = [{
	name: "tealcrows", type: 2,
	date: new Date(2022, 6, 21),
	pages: ["index", "about", "blog", "gallery"],
	blurb: "i coded this version covid-drunk in a hotel room. the textbox took me a while to figure out. the blog page's already here—you can follow its progress through basically all the versions of the site."
},{
	name: "oneshot", type: 0,
	date: new Date(2022, 7, 7),
	pages: ["about"],
	blurb: "based off the computers in oneshot. unfortunately, this is all that's left of this version—i lost the files somewhere along the way."
},{
	name: "corkboard", type: 2,
	date: new Date(2022, 9, 7),
	pages: ["index", "blog"],
	blurb: "an in-between version with draggable pins."
},{
	name: "tv", type: 2,
	date: new Date(2022, 10, 11),
	pages: ["index", "index (xmas)", "blog", "purecontent"],
	blurb: "another in-between version."
},{
	name: "difference", type: 1,
	date: new Date(2022, 11, 17),
	pages: ["index"],
	blurb: "a sketch when i was really obsessed with difference blending."
},{
	name: "rouxls", type: 1,
	date: new Date(2023, 0, 3),
	pages: ["index"],
	blurb: "another sketch, going back a little to the oneshot version."
},{
	name: "stars", type: 2,
	date: new Date(2023, 4, 31),
	pages: ["index", "about", "blog", "screenshots"],
	blurb: ""
},{
	name: "five", type: 2,
	date: new Date(2024, 0, 1),
	pages: ["index", "blog"],
	blurb: "the first version of the site that bore the webcatz name & the patchwork quilt layout. very cluttered, in a fun sort of way. i forgot about that paw-star logo i only used it for like a week"
},{
	name: "fivepointfive", type: 2,
	date: new Date(2024, 6, 2),
	pages: ["index", "about", "muse"],
	blurb: "paring down v5 to something calmer. i still quite like this one."
},{
	name: "fish", type: 2,
	date: new Date(2024, 10, 21),
	pages: ["index", "blog", "archive"],
	blurb: "playing with lighter colors, targeting a dreamier sort of feel."
},{
	name: "planner", type: 1,
	date: new Date(2024, 11, 14),
	pages: ["index"],
	blurb: "notebooky sketch."
}];

const params = new URLSearchParams(location.search);
const view = document.getElementById("view");
const info = document.querySelector("#info dl");
var capture;
var idx;

function setCapture(i, updateParams = true) {
	capture = history[idx = i];
	
	view.src = `_capture/${capture.name}/${capture.pages[0]}.png`;
	info.innerHTML = `
		<dt>edited</dt>
		<dd>${capture.date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}).toLowerCase()}</dd>
		<dt>pages</dt>
		<dd>${capture.pages.map(page => `<button onclick="setPage(${capture.pages.findIndex(p => p == page)})">${page}</button>`).join(" ")}</dd>
		<dt>blurb</dt>
		<dd>${capture.blurb}</dd>
	`;
	
	prevBtn.disabled = idx == 0;
	nextBtn.disabled = idx == history.length - 1;
	if (updateParams) {
		params.set("capture", capture.name);
		params.delete("page");
		window.history.replaceState(null, "", "?" + params);
	}
}

function setPage(i) {
	view.src = "";
	view.src = `_capture/${capture.name}/${capture.pages[i]}.png`;
	params.set("page", capture.pages[i]);
	window.history.replaceState(null, "", "?" + params);
}



// map

const nav = document.querySelector("#map main");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

prevBtn.onclick = () => setCapture(idx - 1);
nextBtn.onclick = () => setCapture(idx + 1);

for (let i = 0; i < history.length; i++) {
	let btn = document.createElement("button");
	btn.title = history[i].name;
	btn.onclick = () => setCapture(i);

	let img = btn.appendChild(document.createElement("img"));
	img.src = `_asset/capture${history[i].type}.png`;
	img.ariaHidden = true;

	nav.prepend(btn);
}



// init

if (params.has("capture")) {
	let i = history.findIndex(c => c.name == params.get("capture"));
	setCapture(i == -1 ? history.length - 1 : i, false);

	if (params.has("page")) {
		let i = capture.pages.findIndex(p => p == params.get("page"));
		if (i != -1) setPage(i);
	}
}
else setCapture(history.length - 1, false);