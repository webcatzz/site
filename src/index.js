// latest tune

document.getElementById("track-name").textContent = tracklist[0].name;
document.getElementById("tunes").querySelector("iframe").src = hashToURL(tracklist[0].hash);
tracklist = null;



// audio pitch easter eggs

const tapeDeck = document.querySelector("tape-deck");
tapeDeck.audio.preservesPitch = false;

var nightcore = false;

document.getElementById("awful-fucking-thing").onclick = function () {
	nightcore = !nightcore;
	document.querySelector("nav").classList.toggle("nightcore");
	updatePitch();
}

var lightsOff = false;

document.getElementById("lightswitch").onclick = function () {
	lightsOff = !lightsOff;
	document.body.classList.toggle("lights-off");
	updatePitch();

	new Audio("https://files.catbox.moe/as06cd.mp3").play();
	if (lightsOff) addEventListener("mousedown", this.onclick, {once: true});
}

function updatePitch() {
	if (lightsOff) tapeDeck.audio.playbackRate = 0.6;
	else if (nightcore) tapeDeck.audio.playbackRate = 1.5;
	else tapeDeck.audio.playbackRate = 1;
}



// theme selector

document.getElementById("theme-select").value = sessionStorage.getItem("theme", this.value) ?? "";
document.getElementById("theme-select").onchange = function () {
	document.body.className = this.value;
	if (this.value) sessionStorage.setItem("theme", this.value);
	else sessionStorage.removeItem("theme");
}