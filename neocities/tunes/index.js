addTracks();
function addTracks() {
	let html = "";
	for (let i = 0; i < tracklist.length; i++) {
		let name = tracklist[i].name, idxs = [], spanOffset = 0;

		for (let spanNum = 0; spanNum < 3 && Math.random() > 0.4; spanNum++) idxs.push(Math.floor(Math.random() * (name.length - 2)));
		for (let ins of idxs.sort((a, b) => {return a - b})) {
			ins += spanOffset, spanOffset += 14;
			name = name.slice(0, ins) + "<span>" + name[ins] + "</span>" + name.slice(ins + 1);
		}

		let inserted = "";
		if (tracklist[i].tags) {
			if (tracklist[i].tags.includes("complete")) inserted += '<img src="_assets/complete.png" alt="complete track" title="complete track">';
			if (tracklist[i].tags.includes("featured")) inserted += '<img src="_assets/featured.png" alt="featured track" title="featured track">';
		}
		if (tracklist[i].date) inserted += `<div class="entry-date">${arrayToDate(tracklist[i].date)}</div>`;

		html += `
		<div class="entry-wrapper${tracklist[i].tags ? " " + tracklist[i].tags.join(" ") : ""}" style="background-color: ${getRandomColor()}">
			<div class="entry unskew" style="--color: ${getRandomColor()}" data-idx="${i}">
				<div class="entry-title">${name}</div>
				${inserted}
			</div>
		</div>
		`;
	}
	document.getElementById("tracklist").insertAdjacentHTML("beforeend", html);
}

const title = document.getElementById("title"), date = document.getElementById("date"), tags = document.getElementById("tags"), comment = document.getElementById("comment");
var firstTime = true, lastPlayer = document.querySelector("iframe");
document.getElementById("tracklist").onclick = event => {if (event.target.classList.contains("entry")) viewTrack(event.target.dataset.idx, event.target.style.getPropertyValue("--color"))};
function viewTrack(i, color) {
	if (firstTime) {firstTime = false; document.getElementById("info").removeAttribute("class")}
	let track = tracklist[i], wrapper = document.getElementById("player");
	// style
	wrapper.style.backgroundColor = color;
	wrapper.animate({clipPath: ["polygon(0 0, calc(30vh + 48px) 0, 0 100%, 0 100%)", "polygon(0 0, calc(100% + 30vh + 48px) 0, 100% 100%, 0 100%)"]}, {duration: 250, easing: "ease-out"});
	// wrapper.animate({clipPath: ["inset(0 100% 0 0)", "inset(0 0 0 0)"]}, 250);
	// track details
	title.textContent = track.name;
	date.textContent = track.date ? arrayToDate(track.date) : "undated";
	if (track.tags) {
		tags.textContent = "#" + track.tags.join(", #");
		tags.classList.remove("hidden");
	} else tags.classList.add("hidden");
	if (track.note) {
		if (track.note.includes("[")) {
			let start, linkComment = track.note;
			do {
				start = linkComment.indexOf("[");
				let end = linkComment.indexOf("]", start), trackName = linkComment.substring(start + 1, end);
				linkComment = linkComment.substring(0, start) + "<a href='?track=" + trackName + "'>" + trackName + "</a>" + linkComment.substring(end + 1);
			} while (start != -1);
			comment.innerHTML = linkComment;
		} else comment.textContent = track.note;
		comment.classList.remove("hidden");
	} else comment.classList.add("hidden");
	// player
	let player;
	if (track.hash) player = document.createElement("iframe"), player.src = getURL(track.hash);
	else player = document.createElement("audio"), player.controls = "true", player.loop = "true", player.src = "https://docs.google.com/uc?id=" + track.link;
	lastPlayer.replaceWith(player);
	lastPlayer = player;
}

function filter(tag) {
	if (tag == "") for (const e of document.getElementsByClassName("entry-wrapper")) e.classList.remove("hidden")
	else for (const e of document.getElementsByClassName("entry-wrapper")) e.classList.contains(tag) ? e.classList.remove("hidden") : e.classList.add("hidden");
}
document.getElementById("filter").onchange = event => filter(event.target.value);
let params = new URLSearchParams(window.location.search);
if (params.has("filter")) {
	let tag = params.get("filter");
	document.getElementById("filter").value = tag;
	filter(tag);
}
if (params.has("track")) {
	let i = tracklist.findIndex(track => track.name == params.get("track"));
	if (i) viewTrack(i, getRandomColor());
}

function arrayToDate(array) {return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][array[1] - 1] + " " + array[0] + ", '" + array[2].toString().substring(2)}
function getRandomColor() {return "#" + ["d62411", "ff8426", "ffd100", "bfff3c", "10d275", "68aed4", "ff2674", "ff80a4"][Math.floor(Math.random() * 8)]}