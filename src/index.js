// audio player

const audioPlayer = document.getElementById("audio-player");
const audioEls = audioPlayer.children;
AudioPlayer.create([
	"First Steps - Lena Raine (Celeste OST)",
	"Forgo's Treasures - Hirokazu Ando (Kirby and the Forgotten Land OST)",
	"Allison's Theme - beatrix quinn (Super Lesbian Animal RPG OST)",
	"Dark Flute - Jim Guthrie (Sword & Sworcery LP - The Ballad of the Space Babies)",
	"Paramnesiac - still crisp (Pseudoregalia OST)",
	"Marine Tube - Go Ichinose (Pokémon Black & White 2 OST)",
	"Relic - Aaron Cherof (Minecraft: Trails & Tales OST)",
	"Eliezer's Waltz - Disparition (Welcome to Night Vale)",
	"I Feel Like (Live) - coffeebug (MIDIfreak)",
	"See You At The Top - Mark Sparling (A Short Hike OST)",
	"pawprints in the snow - coffeebug (haunted sticky notes)",
	"Strange Quest - Joel Corelitz (Eastward OST)",
],{
	playButton: audioEls[3],
	skipButton: audioEls[5],
	insertIcons: true,
	slider: audioEls[4],
	sliderThumb: audioEls[4].children[2],
	sliderProgress: audioEls[4].children[1],
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl",
	onended: () => {
		let newTitle = document.createElement("marquee");
		newTitle.textContent = AudioPlayer.list[AudioPlayer.idx].title, newTitle.className = "lcd", newTitle.scrollAmount = 4;
		audioEls[1].replaceWith(newTitle);
		audioEls[0].textContent = AudioPlayer.idx + 1 + "/" + AudioPlayer.list.length;
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

const nuko = document.getElementById("awful-fucking-thing");
var nightcore = false;

nuko.onclick = function () {
	if (nightcore) {
		AudioPlayer.playbackRate = 1;
		audioPlayer.classList.remove("nightcore");
		nightcore = false;
	} else {
		AudioPlayer.playbackRate = 1.5;
		audioPlayer.classList.add("nightcore");
		nightcore = true;
	}
}

const lightswitch = document.getElementById("lightswitch");
var lightsOff = false;

lightswitch.onclick = function () {
	new Audio("https://files.catbox.moe/as06cd.mp3").play();
	if (lightsOff) {
		AudioPlayer.playbackRate = nightcore ? 1.5 : 1;
		document.body.classList.remove("lights-off");
		lightsOff = false;
	} else {
		AudioPlayer.playbackRate = 0.6;
		document.body.classList.add("lights-off");
		lightsOff = true;
		addEventListener("mousedown", lightswitch.onclick, {once: true})
	}
}



// themes

document.getElementById("theme-select").onchange = function () {
	document.body.className = this.value;
	if (this.value) sessionStorage.setItem("theme", this.value);
	else sessionStorage.removeItem("theme");
}
document.getElementById("theme-select").value = sessionStorage.getItem("theme", this.value) ?? "";