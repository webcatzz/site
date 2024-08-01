// audio player

const player = document.getElementById("audio-player");
AudioPlayer.create([
	"dallas - glass beach",
	"rare animal - glass beach",
	"speedway - black midi",
	"dethroned - black midi",
	"five finger exploding heart technique - ok cool",
	"portrait of a woman on a couch with cats - michael cera palin",
	"weird fishes╱ arpeggi - radiohead",
	"out of season - forest spirit, sun on your back",
	"gmaps - cowboyy",
	"moss on my brick wall - starcleaner reunion",
],{
	playButton: player.children[0],
	skipButton: player.children[1],
	title: player.children[2],
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl"
});

player.children[0].addEventListener("click", function () {
	this.textContent = AudioPlayer.paused ? "play" : "pause";
});

// title ꕀ
for (const track of AudioPlayer.list) track.title = track.title.replace(" - ", " ꕀ ");
player.children[2].textContent = player.children[2].textContent.replace(" - ", " ꕀ ");



// intro marquee
let marquee = document.querySelector("marquee");
let spanned = "";
for (const letter of marquee.textContent) {
	if (letter === " ") spanned += " ";
	else spanned += "<span>" + letter + "</span>";
}
marquee.innerHTML = spanned;