
// audio player

const audioEls = document.getElementById("audio-player").children;
let nightcore = false, lightsOff = false;
AudioPlayer.create([
  {title: "First Steps - Lena Raine (Celeste OST)", src: "https://files.catbox.moe/r676ot.mp3"},
  {title: "Forgo's Treasures - Hirokazu Ando (Kirby and the Forgotten Land OST)", src: "https://files.catbox.moe/6ah5gv.mp3"},
  {title: "Allison's Theme - beatrix quinn (Super Lesbian Animal RPG OST)", src: "https://files.catbox.moe/s72tlt.mp3"},
  {title: "Dark Flute - Jim Guthrie (Sword & Sworcery LP - The Ballad of the Space Babies)", src: "https://files.catbox.moe/gjc4cw.mp3"},
  {title: "Paramnesiac - still crisp (Pseudoregalia OST)", src: "https://files.catbox.moe/et8li0.mp3"},
  {title: "Marine Tube - Go Ichinose (Pokémon Black & White 2 OST)", src: "https://files.catbox.moe/j1thr2.mp3"},
  {title: "Relic - Aaron Cherof (Minecraft: Trails & Tales OST)", src: "https://files.catbox.moe/lvmfv7.mp3"},
  {title: "Eliezer's Waltz - Disparition (Welcome to Night Vale)", src: "https://files.catbox.moe/ul7358.mp3"},
  {title: "I Feel Like (Live) - coffeebug (MIDIfreak)", src: "https://files.catbox.moe/8rw8p8.mp3"},
  {title: "See You At The Top - Mark Sparling (A Short Hike OST)", src: "https://files.catbox.moe/ovcne0.mp3"},
  {title: "Adventure - Disasterpiece (Fez OST)", src: "https://files.catbox.moe/2eoup3.mp3"},
  {title: "pawprints in the snow - coffeebug (haunted sticky notes)", src: "https://files.catbox.moe/hpigll.mp3"},
  {title: "Strange Quest - Joel Corelitz (Eastward OST)", src: "https://files.catbox.moe/yx7opr.mp3"},
],{
  playButton: audioEls[3],
  skipButton: audioEls[5],
  slider: audioEls[4],
  sliderThumb: audioEls[4].children[2],
  sliderProgress: audioEls[4].children[1],
  shuffle: true,
  onended: () => {
    let newTitle = document.createElement("marquee");
    newTitle.textContent = AudioPlayer.list[AudioPlayer.idx].title, newTitle.className = "lcd", newTitle.scrollAmount = 4;
    audioEls[1].replaceWith(newTitle);
    audioEls[0].textContent = AudioPlayer.idx + 1 + "/" + AudioPlayer.list.length;
    if (lightsOff) AudioPlayer.audio.playbackRate = 0.6;
    else if (nightcore) AudioPlayer.audio.playbackRate = 1.5;
  }
});
AudioPlayer.on("durationchange", () => audioEls[2].innerText = Math.floor(AudioPlayer.audio.duration / 60) + ":" + ("0" + Math.round(AudioPlayer.audio.duration % 60)).slice(-2));

AudioPlayer.audio.preservesPitch = false, AudioPlayer.audio.webkitPreservesPitch = false;
document.getElementById("awful-fucking-thing").onclick = () => {
	if (nightcore = !nightcore) {
		document.getElementById("audio-player").classList.add("nightcore");
		document.getElementById("awful-fucking-thing").firstChild.src = "assets/awful-fucking-thing-2.webp";
		AudioPlayer.audio.playbackRate = 1.5;
	} else {
		document.getElementById("audio-player").classList.remove("nightcore");
		document.getElementById("awful-fucking-thing").firstChild.src = "assets/awful-fucking-thing.webp";
		AudioPlayer.audio.playbackRate = 1;
	}
}
document.getElementById("lightswitch").onclick = () => {
  new Audio("https://files.catbox.moe/as06cd.mp3").play();
  if (lightsOff = !lightsOff) {
    document.body.classList.add("lights-off");
    AudioPlayer.audio.playbackRate = 0.6;
  } else {
    document.body.classList.remove("lights-off");
    AudioPlayer.audio.playbackRate = nightcore ? 1.5 : 1;
  }
}


// tunes button

document.getElementById("track-name").textContent = tracklist[0].name;
document.getElementById("tunes").querySelector("iframe").src = getURL(tracklist[0].hash);
tracklist = null;


// laser pointer
var laserPoints = 0;
document.getElementById("laser-pointer").onclick = () => {
  let laser = document.getElementById("laser-pointer");
  laser.style.left = Math.random() * window.innerWidth + "px", laser.style.top = Math.random() * (window.innerHeight - 288) + 288 + "px";
	if (++laserPoints == 4) window.open("https://www.youtube-nocookie.com/embed/fwB8nbI4TuM?si=ghaXscYy5DPXzkhv", "_blank");
}


// clicksplosion effect (adapted from http://www.mf2fm.com/rv)

const starWrapper = document.body.appendChild(document.createElement("div"));
starWrapper.id = "star-wrapper";
const colors = ["var(--blue)", "var(--red)", "var(--yellow)"];
const starMaxX = innerWidth - 7, starMaxY = innerHeight - 7;
let expCount = 0;

onclick = e => {
  if (expCount <= 5) {
    let colori = Math.floor(Math.random() * 3 * colors.length), intensity = 5 + Math.random() * 4;
    let stars = [];
    expCount++;
    for (let i = 0; i < 75; i++) {
      stars[i] = {
        el: document.createElement('div'),
        x: e.pageX, y: e.pageY - 5,
        dX: (Math.random() - 0.5) * 1.25,
        dY: (Math.random() - 0.5) * intensity,
        decay: Math.floor(Math.random() * 16) + 16,
        intensity: intensity,
      };
      stars[i].dX *= intensity - Math.abs(stars[i].dY);
      stars[i].el.className = "star";
      if (colori < colors.length) stars[i].el.style.color = colors[i % 2 ? expCount % colors.length : colori];
      else if (colori < 2 * colors.length) stars[i].el.style.color = colors[expCount % colors.length];
      else stars[i].el.style.color = colors[i % colors.length];
      stars[i].el.ariaHidden = true;
      stars[i].el.append("*");
      starWrapper.appendChild(stars[i].el);
    }
    explode(stars);
  }
}

async function explode(stars) {
  let starCount = 75;
  do {
    for (const star of stars) if (star.decay) {
      star.dY += 1.25 / star.intensity, star.x += star.dX, star.y += star.dY;
      star.el.style.left = star.x + 'px', star.el.style.top = star.y + 'px';
      switch (--star.decay) {
        case 14: star.el.style.fontSize = '7px'; break;
        case 6: star.el.style.fontSize = '2px'; break;
        case 0: star.el.remove(); starCount--;
      }
    }
    await wait(33);
  } while (starCount);
  expCount--;

  function wait(ms) {return new Promise(resolve => setTimeout(resolve, ms))}
}


// chatbox

// let chatboxi = 0;
// document.getElementById("chatbox").addEventListener("toggle", loadChatbox, {once: true});
// function loadChatbox() {
//   loadEntries(chatboxi, 25);
//   let wrapper = document.getElementById("chatbox").children[1];
//   wrapper.onscrollend = () => {if (wrapper.scrollTop == 0) {
//     let oldHeight = wrapper.scrollHeight;
//     loadEntries(chatboxi += 25, 25);
//     wrapper.scrollTop = wrapper.scrollHeight - oldHeight - 32;
//   }}, wrapper.scrollTop = wrapper.scrollHeight;

//   let form = document.getElementById("chatbox-form");
//   form.reset();
//   form.onsubmit = e => {
//     // duplicate junes
//     if (form.querySelector("input[name=\"name\"]").value == "june") {
//       alert("sorry doppeljune. that user's taken");
//       e.preventDefault();
//       return;
//     }

//     let textInput = form.querySelector("input[name=\"text\"]");
//     // sanitizing html
//     for (let i = 0; (i = textInput.value.indexOf("<", i)) != -1; i += 2) {
//       textInput.value = textInput.value.slice(0, i) + "\\" + textInput.value.slice(i);
//     }
//     // adding links
//     for (let i = 0; (i = textInput.value.indexOf("https://", i)) != -1; i = textInput.value.indexOf("</a>", i)) {
//       let end = textInput.value.indexOf(" ", i), link = textInput.value.slice(i, end);
//       textInput.value = textInput.value.slice(0, i) + "<a href=\"" + link + "\">" + link + "</a>" + textInput.value.slice(end);
//     }

//     // timestamping
//     let time = new Date;
//     form.querySelector("input[type=\"hidden\"]").value = `${time.getUTCFullYear()}-${formatNum(time.getUTCMonth() + 1)}-${formatNum(time.getUTCDate())}T${formatNum(time.getUTCHours())}:${formatNum(time.getUTCMinutes())}:${formatNum(time.getUTCSeconds())}.${formatNum(time.getUTCMilliseconds(), 3)}Z`;

//     function formatNum(num, length = 2) {return String(num).padStart(length, "0")}
//   }
// }
// function loadEntries(from, length) {
//   let wrapper = document.getElementById("chatbox").children[1], currentDate = new Date;
//   fetch("https://thought-out-guards.000webhostapp.com/entries.php").then(res => res.json()).then(entries => {
//     let end = entries.length - from;
//     entries = entries.slice(end - length, end);

//     let els = [];
//     for (const entry of entries) {
//       let el = create("article", {class: "comment"});
//       // icon
//       if (entry.icon) el.appendChild(create("img", {src: entry.icon, loading: "lazy", class: "comment-icon"}));
//       // header
//       let header = el.appendChild(document.createElement("header")), name = header.appendChild(create("div", {text: entry.name, class: "comment-name"})), date = new Date(entry.time);
//       if (entry.name == "june") {
//         name.classList.add("webmaster");
//         name.appendChild(create("i", {class: "fa-solid fa-paw"}));
//       }
//       if (entry.link) header.appendChild(create("a", {href: entry.link, class: "comment-link", children: [create("i", {class: "fa-solid fa-arrow-up-right-from-square"})]}));
//       header.appendChild(create("div", {text: toRelative(date), title: date.toLocaleString('en-GB', {day: "numeric", month: "long", year: "numeric", hourCycle: "h12", hour: "numeric", minute: "numeric"}), class: "comment-time"}));
//       // text
//       el.appendChild(create("div", {innerHTML: entry.text}));
//       els.push(el);
//     }
//     wrapper.prepend(...els);
//   });

//   function toRelative(date) {
//     if (currentDate.getMonth() == date.getMonth()) {
//       if (currentDate.getDate() == date.getDate()) {
//         if (currentDate.getHours() == date.getHours()) {
//           if (currentDate.getMinutes() == date.getMinutes()) return "now";
//           else return currentDate.getMinutes() - date.getMinutes() + " minutes ago";
//         } else return currentDate.getHours() - date.getHours() + " hours ago";
//       } else return currentDate.getDate() - date.getDate() + " days ago";
//     } else return currentDate.getMonth() - date.getMonth() + " months ago";
//   }
// }


function create(tag, options = {}) {
  let el = document.createElement(tag);
  if (options.text) el.textContent = getAndDelete(options.text);
  if (options.class) el.className = getAndDelete(options.class);
  if (options.children) for (const child of getAndDelete(options.children)) el.appendChild(child);
  for (const property in options) el[property] = options[property];
  return el;
  function getAndDelete(property) {var value = property; delete property; return value}
}