// links

for (const link of document.querySelectorAll("nav a")) {
	link.title = link.lastChild.data.trim();
	link.dataset.entry = link.getAttribute("href").slice(8, -5);
	link.addEventListener("click", function () {history.replaceState(null, "", "?entry=" + this.dataset.entry)});
}



// entry by url

let entry = new URLSearchParams(location.search).get("entry") ?? document.querySelector("nav a").dataset.entry;
document.getElementById("frame").src = "entries/" + entry + ".html";



// background

let backgrounds = [
  {path: "aquarium.jpg", artist: "lacecap", link: "miffy.carrd.co"},
  {path: "bed.png", artist: "peevishpants", link: "theweiweixu.carrd.co"},
  {path: "bridge.jpg", artist: "mochipanko", link: "mochipanko.tumblr.com"},
];
let background = backgrounds[Math.floor(Math.random() * backgrounds.length)];

document.body.style.setProperty("--background", `url(_assets/backgrounds/${background.path})`);
document.getElementById("background-credit").textContent = "art by @" + background.artist;
document.getElementById("background-credit").href = "https://" + background.link;



// audio

const audioEls = document.getElementById("player").children;
AudioPlayer.create([
  "10 pm (sunny) - kazumi totaka",
	"wedding (garden) - kazumi totaka",
  "blogger sits alone at night - coffeebug",
  "fall (raven's descent) - concernedape",
  "the tempest - louie zong",
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