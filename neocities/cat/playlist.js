AudioPlayer.create([
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

// autoplay warning
document.getElementById("player").classList.add("no-autoplay");