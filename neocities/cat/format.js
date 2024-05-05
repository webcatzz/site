document.title = "☾⋆⁺₊ " + (document.querySelector("h2")?.textContent ?? "cat comic...ᐟ");
let content = Array.from(document.body.children);
document.body.innerHTML = `
<header>

	<h1>cat comic</h1>

	<div id="construction" style="font-size: 0.625em; align-self: center">under construction!</div>

	<div id="player" class="pxl">
		<marquee></marquee>
		<button id="play" title="play"></button>
		<button id="skip" title="skip"></button>
		<button id="reset" title="reset data"></button>
	</div>

</header>

<nav>

	<h2>://nav</h2>
	<a class="pxl button" href="index.html">about</a>
	<a class="pxl button" href="world.html">world</a>
	<a class="pxl button" href="cast.html">cast</a>
	<a class="pxl button" href="blog.html">blog</a>
	<a class="pxl button" href="extras.html">extras</a>
	
	<div id="home">
		<a class="pxl button" href="../index.html">exit</a>
	</div>

</nav>
`;
document.body.appendChild(document.createElement("main")).append(...content);
document.body.classList.add("loaded");




// audio player

// shuffle
let playlist;
if (sessionStorage.getItem("audio-list") != null) playlist = sessionStorage.getItem("audio-list").split(",");
else {
	playlist = [
		"(forever?????????) - glass beach",
		"angel surveillance - bubblebaath",
		"aria math - c418",
		"astronaut - jack stauber's micropop",
		"axolotl - c418",
		"balduin - thomas hoehl",
		"ballad of awakening - malcolm brown",
		"bloodflow.wav - classic j",
		"checking in - lena raine",
		"city night - joel corelitz",
		"cloudy out - eel valley",
		"crystalguitarthemums - erik scheele",
		"first snow - max ll",
		"floating away - jun ishikawa",
		"forsaken grotto - curtis schweitzer",
		"glimmer - joel corelitz",
		"hippocampus sea - levc",
		"interlude - feed me jack",
		"job done - thomas hoehl",
		"little furnace - jim guthrie",
		"loop blues - blinch",
		"moonsetter - toby fox",
		"ocean stars falling - michael guy bowman",
		"planet healer - meruz",
		"prayer - kow otani",
		"reactivating the first purifier - thomas hoehl",
		"respit - erik scheele",
		"shoreline scuffle - beatrix quinn",
		"skaia (incipisphere mix) - solatrus",
		"stellar acclimation - curtis schweitzer",
		"strato - jonathan geer",
		"sworn guardian - beatrix quinn",
		"temporary - robert j! lake",
		"thanks for playing - max wright",
		"the maelstrom - jim guthrie",
		"the rain - coffeebug",
		"woody path - joel corelitz",
		"yamanoue no machi - joel corelitz",
		"ゆめうつつ (half asleep) - lamp"
	]
	let thisi = playlist.length, randi;
	while (thisi > 0) randi = Math.floor(Math.random() * thisi--), [playlist[thisi], playlist[randi]] = [playlist[randi], playlist[thisi]];
}


// creating player
AudioPlayer.create(playlist, {
	playButton: document.getElementById("play"),
	skipButton: document.getElementById("skip"),
	fileGarden: "ZdmFgugxzVCR-8Bl",
});

// marquee
AudioPlayer.marquee = document.querySelector("marquee");
function setMarquee() {
	let repl = document.createElement("marquee");
	repl.textContent = AudioPlayer.list[AudioPlayer.idx].title;
	repl.scrollAmount = 2;
	AudioPlayer.marquee.replaceWith(repl);
	AudioPlayer.marquee = repl;
}
setMarquee();
AudioPlayer.addEventListener("ended", setMarquee);


// inter-page playback
if (sessionStorage.getItem("audio-idx") != null) {
  AudioPlayer.idx = sessionStorage.getItem("audio-idx") - 1;
	AudioPlayer.next();
	if (sessionStorage.getItem("audio-paused") == "true") AudioPlayer.pause();
  AudioPlayer.currentTime = sessionStorage.getItem("audio-time");
	sessionStorage.clear();
}
onbeforeunload = () => {
	sessionStorage.setItem("audio-list", AudioPlayer.list.map(track => track.title).join());
  sessionStorage.setItem("audio-idx", AudioPlayer.idx);
  sessionStorage.setItem("audio-time", AudioPlayer.currentTime);
	sessionStorage.setItem("audio-paused", AudioPlayer.paused);
}

// clear button
document.getElementById("reset").onclick = () => {
	sessionStorage.clear();
	onbeforeunload = null;
	location.reload();
}

// autoplay warning
document.getElementById("player").classList.add("no-autoplay");


// clouds
onscroll = () => document.body.style.setProperty("--scroll", -scrollY / 8 + "px");