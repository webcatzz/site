// audio player

const player = document.getElementById("player");
AudioPlayer.create([
	"dallas - glass beach",
	"motions - glass beach",
	"rare animal - glass beach",
	"200 - glass beach",
	"speedway - black midi",
	"dethroned - black midi",
	"still - black midi",
	"change your name - see through person",
	"calico - ok glass",
	"subterranean homesick alien - radiohead",
	"心に雲を持つ少年 - sunny day service",
	"five finger exploding heart technique - ok cool",
	"saucy!!! - red sun",
	"portrait of a woman on a couch with cats - michael cera palin",
	"paper planes - twikipedia",
	"eat me alive - saturdays at your place",
	"mother mary - late bloomer",
	"chainsaw girl - chainsaw girl",
],{
	playButton: player.children[0],
	skipButton: player.children[1],
	title: player.children[2],
	insertIcons: true,
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl"
});

// title ꕀ
for (const track of AudioPlayer.list) track.title = track.title.replace(" - ", " ꕀ ");
player.children[2].textContent = player.children[2].textContent.replace(" - ", " ꕀ ");



// intro marquee
let marquee = document.getElementById("intro-scroll");
let spanned = "";
for (const letter of marquee.textContent) {
	if (letter === " ") spanned += " ";
	else spanned += "<span>" + letter + "</span>";
}
marquee.innerHTML = spanned;