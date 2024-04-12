const select = document.getElementById("player-select");
AudioPlayer.create([
	"assisted harakiri - home is where",
	"bedroom community - glass beach",
	"call me pretty - echinacea",
	"calico - ok glass",
	"change your name - see through person",
	"come in - weatherday",
	"commatose - glass beach",
	"dallas - glass beach",
	"fake violins - casio dad",
	"foe paw - the j arthur keenes band",
	"our story - stomach book",
	"pipeline punch - newgrounds death rugby",
	"slip under the door - glass beach",
	"subterranean homesick alien - radiohead",
	"zipper - mover shaker",
	"心に雲を持つ少年 - sunny day service",
],{
	playButton: document.getElementById("player-button"),
	insertIcons: true,
	slider: document.getElementById("player-slider"),
	sliderThumb: document.getElementById("player-slider").querySelector("div:last-of-type"),
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl",
	onended: () => select.value = AudioPlayer.idx
});
for (let i = 0; i < AudioPlayer.list.length; i++) {
	let option = select.appendChild(document.createElement("option"));
	option.label = AudioPlayer.list[i].title, option.value = i;
}
select.onchange = () => {
	AudioPlayer.idx = Number(select.value) - 1;
	AudioPlayer.next();
}

// perspective origin
const main = document.getElementById("main");
let rect = main.getBoundingClientRect();
let centerX = rect.left + rect.width / 2;
let centerY = rect.top + document.body.offsetHeight / 2;
let centerXOff = rect.width / 2;
onmousemove = e => {
	let x = (centerX - e.x) / 5 + centerXOff;
	let y = (centerY - e.y) / 5;
	main.style.perspectiveOrigin = x + "px " + y + "px";
}


// toggling perspective
function togglePerspective() {
	document.getElementById("perspective-toggle").checked ? main.removeAttribute("style") : main.style.perspective = "none";
}
document.getElementById("perspective-toggle").onchange = togglePerspective;
togglePerspective();


// strawberry
document.getElementById("strawberry").onclick = function () {
	let sfx = new Audio("https://files.catbox.moe/fj0udt.wav");
	sfx.onloadeddata = () => {
		this.style.animation = "2.75s fly 0.5s forwards";
	}
	sfx.play();

	function intercept(e) {e.stopImmediatePropagation()}
}

// explode
document.getElementById("explode").onclick = e => {
	let gif = document.createElement("img");
	gif.src = "assets/spr_realisticexplosion.gif";
	gif.style.position = "fixed", gif.style.left = e.x - 35.5 + "px", gif.style.top = e.y - 55 + "px", gif.style.pointerEvents = "none";
	document.body.appendChild(gif);
	setTimeout(() => gif.remove(), 1000);
}