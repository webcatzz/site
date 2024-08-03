// audio player

const audioPlayer = document.getElementById("audio-player");
AudioPlayer.create([
	"First Steps - Lena Raine (Celeste OST)",
	"Forgo's Treasures - Hirokazu Ando (Kirby and the Forgotten Land OST)",
	"Allison's Theme - beatrix quinn (Super Lesbian Animal RPG OST)",
	"Dark Flute - Jim Guthrie (Sword & Sworcery LP - The Ballad of the Space Babies)",
	"Paramnesiac - still crisp (Pseudoregalia OST)",
	"Marine Tube - Go Ichinose (Pokémon Black & White 2 OST)",
	"Relic - Aaron Cherof (Minecraft: Trails & Tales OST)",
	"I Feel Like (Live) - coffeebug (MIDIfreak)",
	"See You At The Top - Mark Sparling (A Short Hike OST)",
	"pawprints in the snow - coffeebug (haunted sticky notes)",
	"Strange Quest - Joel Corelitz (Eastward OST)",
],{
	playButton: audioPlayer.children[0],
	skipButton: audioPlayer.children[1],
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl",
	onended: () => {
		let newTitle = document.createElement("marquee");
		newTitle.textContent = AudioPlayer.list[AudioPlayer.idx].title;
		newTitle.className = "lcd";
		newTitle.scrollAmount = 4;
		audioPlayer.children[2].replaceWith(newTitle);
		if (lightsOff) AudioPlayer.playbackRate = 0.6;
		else if (nightcore) AudioPlayer.playbackRate = 1.5;
	}
});



// latest tune

document.getElementById("track-name").textContent = tracklist[0].name;
document.getElementById("tunes").querySelector("iframe").src = hashToURL(tracklist[0].hash);
tracklist = null;



// audio pitch easter eggs

AudioPlayer.preservesPitch = false;

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
	if (lightsOff) AudioPlayer.playbackRate = 0.6;
	else if (nightcore) AudioPlayer.playbackRate = 1.5;
	else AudioPlayer.playbackRate = 1;
}



// theme selector

document.getElementById("theme-select").value = sessionStorage.getItem("theme", this.value) ?? "";
document.getElementById("theme-select").onchange = function () {
	document.body.className = this.value;
	if (this.value) sessionStorage.setItem("theme", this.value);
	else sessionStorage.removeItem("theme");
}