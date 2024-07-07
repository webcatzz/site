// links

for (const link of document.querySelectorAll("nav a")) {
	link.title = link.lastChild.data.trim();
	link.dataset.entry = link.getAttribute("href").slice(8, -5);
	link.addEventListener("click", function () {history.pushState(null, "", "?entry=" + this.dataset.entry)});
}



// entry by url

let entry = new URLSearchParams(location.search).get("entry") ?? document.querySelector("nav a").dataset.entry;
document.getElementById("frame").src = "entries/" + entry + ".html";



// background

let background = [
	{path: "aquarium.jpg", artist: "lacecap", link: "miffy.carrd.co"},
	{path: "bed.png", artist: "peevishpants", link: "theweiweixu.carrd.co"},
	{path: "bridge.jpg", artist: "mochipanko", link: "mochipanko.tumblr.com"},
][Math.floor(Math.random() * 3)];

document.body.style.setProperty("--background", `url(_assets/backgrounds/${background.path})`);
document.getElementById("background-credit").textContent = "background by " + background.artist;
document.getElementById("background-credit").href = "https://" + background.link;



// audio

const audioEls = document.getElementById("player").children;
AudioPlayer.create([
	"10 pm (sunny) - kazumi totaka",
	"wedding (i want a garden theme!) - kazumi totaka",
	"blogger sits alone at night - coffeebug",
	"fall (raven's descent) - concernedape",
	"the tempest - louie zong",
	"café midi - coffeebug",
],{
	playButton: audioEls[0],
	skipButton: audioEls[1],
	insertIcons: true,
	fileGarden: "ZdmFgugxzVCR-8Bl",
	shuffle: true,
	onended: () => {
		let title = document.createElement("marquee");
		title.direction = "up";
		title.appendChild(document.createElement("span")).textContent = AudioPlayer.list[AudioPlayer.idx].title;
		audioEls[2].replaceWith(title);
	}
});