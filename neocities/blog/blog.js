// entry by url

let entry = new URLSearchParams(location.search).get("entry") ?? document.querySelectorAll("nav a").length;
document.getElementById("frame").src = "entries/" + entry + ".html";



// links

for (const link of document.querySelectorAll("nav a")) {
	link.title = link.lastChild.data.trim();
}



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
  {title: "10 PM (Sunny) - Kazumi Totaka (Animal Crossing: New Horizons OST)", src: "https://files.catbox.moe/6thmxx.mp3"},
  {title: "blogger sits alone at night - coffeebug (MIDIfreak)", src: "https://files.catbox.moe/zhcwni.mp3"},
  {title: "9 AM (Sunny) - Kazumi Totaka (Animal Crossing: New Leaf OST)", src: "https://files.catbox.moe/6icoyz.mp3"},
  {title: "Somewhere in the Woods - Mark Sparling (A Short Hike OST)", src: "https://files.catbox.moe/larajz.mp3"},
  {title: "Fall (Raven's Descent) - ConcernedApe (Stardew Valley OST)", src: "https://files.catbox.moe/n5z24r.mp3"},
  {title: "Box Has Key (Temple Ruins) - Arvi Teikari (Baba is You OST)", src: "https://files.catbox.moe/xgna8y.mp3"},
  {title: "The Tempest - Louie Zong (Wanderer)", src: "https://files.catbox.moe/xw3n4f.mp3"},
  {title: "Music for Animal Cafés - nobonoko (Music for Animal Cafés)", src: "https://files.catbox.moe/63er7i.mp3"}
],{
  playButton: audioEls[0],
  skipButton: audioEls[1],
  insertIcons: true,
  shuffle: true,
  onended: () => {
    let title = document.createElement("marquee");
    title.direction = "up";
    title.appendChild(document.createElement("span")).textContent = AudioPlayer.list[AudioPlayer.idx].title;
    audioEls[2].replaceWith(title);
  }
});