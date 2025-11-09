const radius = 300;
const center = [innerWidth / 2, innerHeight / 2];
const points = [];
const songs = [
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/site/weirdweb_catastrophe.mp3"),
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/site/weirdweb_sully.mp3"),
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/site/weirdweb_mole.mp3"),
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/site/weirdweb_badibaba.mp3"),
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/site/weirdweb_buddy_in_the_parade.mp3"),
];

function updateVolumes(x, y) {
	x -= innerWidth / 2;
	y -= innerHeight / 2;
	for (let i = 0; i < songs.length; i++) {
		songs[i].volume = 1 - Math.min(1, Math.sqrt(Math.pow(points[i][0] - x, 2) + Math.pow(points[i][1] - y, 2)) / radius);
	}
}

// calculating points

for (let i = 0; i < songs.length; i++) {
	let angle = Math.PI / -2 + Math.PI / songs.length * 2 * i;
	points.push([Math.cos(angle) * radius / 2, Math.sin(angle) * radius / 2]);
}

// updating style

document.body.style.setProperty("--gradient-size", radius + "px");
for (let i = 0; i < points.length; i++) {
	document.body.style.setProperty(`--point-${i + 1}-x`, `${points[i][0]}px`);
	document.body.style.setProperty(`--point-${i + 1}-y`, `${points[i][1]}px`);
}

// spanning title text

for (const title of document.getElementsByClassName("title")) {
	title.replaceChildren(...title.textContent.split("").map(letter => {
		let el = document.createElement("span");
		el.textContent = letter;
		return el;
	}));
}

// setup

document.getElementById("popup-accept").addEventListener("click", () => {
	document.getElementById("popup").hidden = true;
	updateVolumes(innerWidth / 2, innerHeight / 2);
	addEventListener("mousemove", e => updateVolumes(e.x, e.y));
	for (const song of songs) {
		song.loop = true;
		song.currentTime = Math.random() * song.duration;
		song.play();
	}
});