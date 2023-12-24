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
function onLinkClicked(e) {main.scrollTo({top: main.children[Array.prototype.indexOf.call(navLinks, e.target)].offsetTop - 48, behavior: "smooth"})}
// url param scroll
let params = new URLSearchParams(window.location.search);
if (params.has("entry")) main.scrollTo({top: main.children[main.childElementCount - params.get("entry")].offsetTop - 48, behavior: "smooth"});

// moods (available: err, amused, happy, excited, aloof, sad, stressed, angry, tired, exhausted, cool)
for (const el of document.getElementsByClassName("mood")) el.firstElementChild.textContent = "feeling" + ["", " oh so", " pretty", " downright"][Math.floor(Math.random() * 4)] + "... ", el.lastElementChild.onclick = meow;
function meow() {new Audio(["https://files.catbox.moe/dmdijd.mp3", "https://files.catbox.moe/tm6s1o.mp3"][Math.floor(Math.random() * 2)]).play()}

// images
for (const img of document.getElementById("main-wrapper").querySelectorAll("img:not(.no-modal)")) img.onclick = openImg;
function openImg(e) {window.open(e.target.src).focus()}

// music
createAudioPlayer([
  {title: "10 PM (Sunny) - Kazumi Totaka (Animal Crossing: New Horizons OST)", link: "https://files.catbox.moe/6thmxx.mp3"},
  {title: "blogger sits alone at night - coffeebug (MIDIfreak)", link: "https://files.catbox.moe/zhcwni.mp3"},
  {title: "9 AM (Sunny) - Kazumi Totaka (Animal Crossing: New Leaf OST)", link: "https://files.catbox.moe/6icoyz.mp3"},
  {title: "Somewhere in the Woods - Mark Sparling (A Short Hike OST)", link: "https://files.catbox.moe/larajz.mp3"},
  {title: "Fall (Raven's Descent) - ConcernedApe (Stardew Valley OST)", link: "https://files.catbox.moe/n5z24r.mp3"},
  {title: "Box Has Key (Temple Ruins) - Arvi Teikari (Baba is You OST)", link: "https://files.catbox.moe/xgna8y.mp3"},
  {title: "The Tempest - Louie Zong (Wanderer)", link: "https://files.catbox.moe/xw3n4f.mp3"},
  {title: "Music for Animal Cafés - nobonoko (Music for Animal Cafés)", link: "https://files.catbox.moe/63er7i.mp3"},
  {title: "killer tune kills me - KIRINJI, YonYon", link: "https://files.catbox.moe/94cu6j.mp3"}
],{
  playButton: document.getElementById("audio-play"),
  skipButton: document.getElementById("audio-skip"),
  title: document.getElementById("audio-title"),
  titleWrapsMarquee: true, verticalMarquee: true,
  shuffle: true,
});