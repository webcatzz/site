// pitch

const tapeDeck = document.querySelector("tape-deck");
tapeDeck.audio.preservesPitch = false;
tapeDeck.audio.addEventListener("play", updatePitch);

var nightcore = false;

document.getElementById("awful-fucking-thing").onclick = function () {
	nightcore = !nightcore;
	tapeDeck.classList.toggle("nightcore");
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



// high contrast

const contrastToggle = document.querySelector("#contrast-toggle input");
contrastToggle.onclick = () => {
	document.body.classList.toggle("high-contrast", contrastToggle.checked);
}
contrastToggle.onclick();