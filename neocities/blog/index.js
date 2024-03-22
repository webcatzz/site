// random stuff (bg + header)
let bg = [
  {file: "bg_aquarium.jpg", artist: "lacecap", link: "https://miffy.carrd.co/"},
  {file: "bg_bed.png", artist: "peevishpants", link: "https://theweiweixu.carrd.co/"},
  {file: "bg_bridge.jpg", artist: "mochipanko", link: "https://mochipanko.tumblr.com"},
  {file: "bg_concrete.jpg", artist: "meetimeeti", link: "https://pillar.io/meetimeeti"},
  {file: "bg_corner.jpg", artist: "Kevin Scarborough", link: "https://kevinscarborough.com"},
  {file: "bg_highway.jpg", artist: "Kevin Scarborough", link: "https://kevinscarborough.com"},
  {file: "bg_road.png", artist: "disasterzoo", link: "https://linktr.ee/disasterzoo"},
  {file: "bg_split.png", artist: "soupcats", link: "https://linktr.ee/soupandcats"},
  {file: "bg_towerbridge.jpg", artist: "Kevin Scarborough", link: "https://kevinscarborough.com"},
][Math.floor(Math.random() * 9)];
document.body.style.setProperty("--background", "url(assets/" + bg.file + ")"), document.getElementById("creditlink").textContent = "@" + bg.artist, document.getElementById("creditlink").href = bg.link;
if (Math.random() > 0.95) document.querySelector("h1").innerHTML = '<img src="assets/alt-title.png">';


// entry links
const main = document.querySelector("main"), navLinks = document.querySelector("nav").getElementsByTagName("a");
for (const link of navLinks) link.onclick = onLinkClicked;
function onLinkClicked(e) {main.scrollTo({top: main.children[Array.prototype.indexOf.call(navLinks, e.target)].offsetTop - 48})}
// url hash scroll
if (location.hash) main.scrollTo({top: main.children[main.childElementCount - Number(location.hash.substring(1))].offsetTop - 48});
// "new" marker
navLinks[0].classList.add("new");


// moods (available: err, amused, happy, excited, aloof, sad, stressed, angry, tired, exhausted, cool)
for (const el of document.getElementsByClassName("mood")) el.firstElementChild.textContent = "feeling" + ["", " oh so", " pretty", " downright"][Math.floor(Math.random() * 4)] + "... ", el.lastElementChild.onclick = meow;
function meow() {new Audio(["https://files.catbox.moe/dmdijd.mp3", "https://files.catbox.moe/tm6s1o.mp3"][Math.floor(Math.random() * 2)]).play()}


// music
const audioEls = document.getElementById("audio-player").children;
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