AudioPlayer.create([
	"(forever?????????) - glass beach",
	"angel surveillance - bubblebaath",
	"astronaut - jack stauber's micropop",
	"axolotl - c418",
	"balduin - thomas hoehl",
	"checking in - lena raine",
	"city night - joel corelitz",
	"cloudy out - eel valley",
	"floating away - jun ishikawa",
	"glimmer - joel corelitz",
	"hippocampus sea - levc",
	"interlude - feed me jack",
	"job done - thomas hoehl",
	"ocean stars falling - michael guy bowman",
	"prayer - kow otani",
	"reactivating the first purifier - thomas hoehl",
	"respit - erik scheele",
	"shoreline scuffle - beatrix quinn",
	"strato - jonathan geer",
	"sworn guardian - beatrix quinn",
	"the rain - coffeebug",
	"unused demo 2 - mark sparling",
	"woody path - joel corelitz",
	"ゆめうつつ (half asleep) - lamp"
	// some ghibli?
],{
	playButton: document.getElementById("play"),
	skipButton: document.getElementById("skip"),
	shuffle: true,
	fileGarden: "ZdmFgugxzVCR-8Bl"
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

// yank disc
document.getElementById("reset").onclick = () => location.reload();