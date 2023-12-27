
// audio

const audioEls = document.getElementById("audio-player").children;
let nightcore = false, lightsOff = false;
createAudioPlayer([
  {title: "First Steps - Lena Raine (Celeste OST)", link: "https://files.catbox.moe/r676ot.mp3"},
  {title: "Forgo's Treasures - Hirokazu Ando (Kirby and the Forgotten Land OST)", link: "https://files.catbox.moe/6ah5gv.mp3"},
  {title: "Allison's Theme - beatrix quinn (Super Lesbian Animal RPG OST)", link: "https://files.catbox.moe/s72tlt.mp3"},
  {title: "Dark Flute - Jim Guthrie (Sword & Sworcery LP - The Ballad of the Space Babies)", link: "https://files.catbox.moe/gjc4cw.mp3"},
  {title: "Paramnesiac - still crisp (Pseudoregalia OST)", link: "https://files.catbox.moe/et8li0.mp3"},
  {title: "Marine Tube - Go Ichinose (Pokémon Black & White 2 OST)", link: "https://files.catbox.moe/j1thr2.mp3"},
  {title: "Relic - Aaron Cherof (Minecraft: Trails & Tales OST)", link: "https://files.catbox.moe/lvmfv7.mp3"},
  {title: "Eliezer's Waltz - Disparition (Welcome to Night Vale)", link: "https://files.catbox.moe/ul7358.mp3"},
  {title: "I Feel Like (Live) - coffeebug (MIDIfreak)", link: "https://files.catbox.moe/8rw8p8.mp3"},
  {title: "See You At The Top - Mark Sparling (A Short Hike OST)", link: "https://files.catbox.moe/ovcne0.mp3"},
  {title: "Adventure - Disasterpiece (Fez OST)", link: "https://files.catbox.moe/2eoup3.mp3"},
  {title: "pawprints in the snow - coffeebug (haunted sticky notes)", link: "https://files.catbox.moe/hpigll.mp3"},
],{
  playButton: audioEls[3],
  skipButton: audioEls[5],
  shuffle: true,
  onEnded: () => {
    let newTitle = document.createElement("marquee");
    newTitle.textContent = playlist[playlistIdx].title, newTitle.className = "lcd", newTitle.scrollAmount = 4;
    audioEls[1].replaceWith(newTitle);
    audioEls[0].textContent = playlistIdx + 1 + "/" + playlist.length;
    if (lightsOff) audio.playbackRate = 0.6;
    else if (nightcore) audio.playbackRate = 1.5;
  }
});

const seekbar = audioEls[4], seekEls = seekbar.children;
let seekbarActive;
audio.ondurationchange = () => {
  seekbar.ariaValueMax = audio.duration;
  audioEls[2].innerText = Math.floor(audio.duration / 60) + ":" + ("0" + Math.round(audio.duration % 60)).slice(-2);
}
audio.ontimeupdate = () => {
  seekbar.ariaValueNow = audio.currentTime;
  let percent = seekbar.ariaValueNow / seekbar.ariaValueMax;
  seekEls[1].style.width = seekbar.clientWidth * percent + "px";
  seekEls[2].style.left = (seekbar.clientWidth - 24) * percent + "px";
}
seekbar.onmousedown = () => seekbarActive = true;
seekbar.onmouseup = e => {
  seekbarActive = false;
  audio.currentTime = seekbar.ariaValueMax * e.offsetX / seekbar.clientWidth;
}
seekbar.onmousemove = e => {if (seekbarActive) {
  seekEls[1].style.width = e.offsetX + "px";
  seekEls[2].style.left = e.offsetX - 24 * e.offsetX / seekbar.clientWidth + "px";
}}

audio.preservesPitch = false, audio.webkitPreservesPitch = false;
document.getElementById("awful-fucking-thing").onclick = () => {
	if (nightcore = !nightcore) {
		document.getElementById("audio-player").classList.add("nightcore");
		document.getElementById("awful-fucking-thing").firstChild.src = "assets/awful-fucking-thing-2.webp";
		audio.playbackRate = 1.5;
	} else {
		document.getElementById("audio-player").classList.remove("nightcore");
		document.getElementById("awful-fucking-thing").firstChild.src = "assets/awful-fucking-thing.webp";
		audio.playbackRate = 1;
	}
}
document.getElementById("lightswitch").onclick = () => {
  new Audio("https://files.catbox.moe/as06cd.mp3").play();
  if (lightsOff = !lightsOff) {
    document.body.classList.add("lights-off");
    audio.playbackRate = 0.6;
  } else {
    document.body.classList.remove("lights-off");
    audio.playbackRate = nightcore ? 1.5 : 1;
  }
}


// tunes button

document.getElementById("track-name").textContent = tracklist[0].name;
document.getElementById("tunes").querySelector("iframe").src = getURL(tracklist[0].hash);
tracklist = null;


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

let chatboxi = 0;
document.getElementById("chatbox").addEventListener("toggle", loadChatbox, {once: true});
function loadChatbox() {
  loadEntries(chatboxi, 25);
  let wrapper = document.getElementById("chatbox").children[1];
  wrapper.onscrollend = () => {if (wrapper.scrollTop == 0) {
    let oldHeight = wrapper.scrollHeight;
    loadEntries(chatboxi += 25, 25);
    wrapper.scrollTop = wrapper.scrollHeight - oldHeight - 32;
  }}, wrapper.scrollTop = wrapper.scrollHeight;

  let form = document.getElementById("chatbox-form");
  form.reset();
  form.onsubmit = e => {
    // duplicate junes
    if (form.querySelector("input[name=\"name\"]").value == "june") {
      alert("sorry doppeljune. that user's taken");
      e.preventDefault();
      return;
    }

    let textInput = form.querySelector("input[name=\"text\"]");
    // sanitizing html
    for (let i = 0; (i = textInput.value.indexOf("<", i)) != -1; i += 2) {
      textInput.value = textInput.value.slice(0, i) + "\\" + textInput.value.slice(i);
    }
    // adding links
    for (let i = 0; (i = textInput.value.indexOf("https://", i)) != -1; i = textInput.value.indexOf("</a>", i)) {
      let end = textInput.value.indexOf(" ", i), link = textInput.value.slice(i, end);
      textInput.value = textInput.value.slice(0, i) + "<a href=\"" + link + "\">" + link + "</a>" + textInput.value.slice(end);
    }

    // timestamping
    let time = new Date;
    form.querySelector("input[type=\"hidden\"]").value = `${time.getUTCFullYear()}-${formatNum(time.getUTCMonth() + 1)}-${formatNum(time.getUTCDate())}T${formatNum(time.getUTCHours())}:${formatNum(time.getUTCMinutes())}:${formatNum(time.getUTCSeconds())}.${formatNum(time.getUTCMilliseconds(), 3)}Z`;

    function formatNum(num, length = 2) {return String(num).padStart(length, "0")}
  }
}
function loadEntries(from, length) {
  let wrapper = document.getElementById("chatbox").children[1], currentDate = new Date;
  fetch("https://thought-out-guards.000webhostapp.com/entries.php").then(res => res.json()).then(entries => {
    let end = entries.length - from;
    entries = entries.slice(end - length, end);

    let els = [];
    for (const entry of entries) {
      let el = create("article", {class: "comment"});
      // icon
      if (entry.icon) el.appendChild(create("img", {src: entry.icon, loading: "lazy", class: "comment-icon"}));
      // header
      let header = el.appendChild(document.createElement("header")), name = header.appendChild(create("div", {text: entry.name, class: "comment-name"})), date = new Date(entry.time);
      if (entry.name == "june") {
        name.classList.add("webmaster");
        name.appendChild(create("i", {class: "fa-solid fa-paw"}));
      }
      if (entry.link) header.appendChild(create("a", {href: entry.link, class: "comment-link", children: [create("i", {class: "fa-solid fa-arrow-up-right-from-square"})]}));
      header.appendChild(create("div", {text: toRelative(date), title: date.toLocaleString('en-GB', {day: "numeric", month: "long", year: "numeric", hourCycle: "h12", hour: "numeric", minute: "numeric"}), class: "comment-time"}));
      // text
      el.appendChild(create("div", {innerHTML: entry.text}));
      els.push(el);
    }
    wrapper.prepend(...els);
  });

  function toRelative(date) {
    if (currentDate.getMonth() == date.getMonth()) {
      if (currentDate.getDate() == date.getDate()) {
        if (currentDate.getHours() == date.getHours()) {
          if (currentDate.getMinutes() == date.getMinutes()) return "now";
          else return currentDate.getMinutes() - date.getMinutes() + " minutes ago";
        } else return currentDate.getHours() - date.getHours() + " hours ago";
      } else return currentDate.getDate() - date.getDate() + " days ago";
    } else return currentDate.getMonth() - date.getMonth() + " months ago";
  }
}


function create(tag, options = {}) {
  let el = document.createElement(tag);
  if (options.text) el.textContent = getAndDelete(options.text);
  if (options.class) el.className = getAndDelete(options.class);
  if (options.children) for (const child of getAndDelete(options.children)) el.appendChild(child);
  for (const property in options) el[property] = options[property];
  return el;
  function getAndDelete(property) {var value = property; delete property; return value}
}


let temp = `# 25.11.23
- [cat comic page](cat/index.html) tweaks
- [first cat comic blog post](cat/blog/1.html)!

# 23.11.23
- fixing things for mobile

# 13.11.23
- added image modal to <a href="blog/index.html">blog</a>
- added <a href="art/index.html">art page</a>
- fixed positioning issue on <a href="creata/index.html">creata page</a>

# 30.10.23
- added the <a href="tarot/index.html">middling arcana</a>

# 29.10.23
- tidied up some repetitive code into a single audio player script + most audio players now shuffle
- redid <a href="blog/index.html">blog</a> playlist
- tiny changes to nightcore/lightswitchcore

# 27.10.23
- wiped, tweaked and relinked <a href="blog/index.html">blog page</a> (with a few entries up already)

# 25.10.23
- added <a href="cat/index.html">cat comic</a> and <a href="blog/index.html">blog</a> buttons to index (shh... the blog isn't here yet...)
- tweaked <a href="cat/index.html">cat comic index</a> a little

# 14.10.23
- fixed the <a href="tunes/index.html">tunes</a> button on the index
- improved <a href="tunes/index.html">tunes</a> filtering, added little icons to certain tags
- made the awful fucking thing easier to click (otherwise it was nearly impossible to exit out of nightcore mode)

# 13.10.23
- redid <a href="tunes/index.html">tunes</a> page it is looking sexy

# 11.10.23
- added <a href="creata/index.html">creata</a> and <a href="creata/timeline.html">timeline</a> pages
- added <a href="cat/index.html">cat comic</a> index & doodles

# 7.10.23
- tidied up index page (deferred all the scripts and iframes + cleaned up my code) so it loads faster now!
- hey... someone's shining a laser pointer on the index!

# 24.9.23
- tweaked index a little. moved a lot of styling into classes also
- added allison's theme from slarpg to audio player
- added <a href="span-ify.html">span-ify</a> (i needed it for a shrine coming soon and i am giving it graciously to you too)

# 5.9.23
- added <a href="discord.html">discord tester</a>

# 31.8.23
- added <a href="ough/baba/index.html">baba is you</a> shrine

# 22.8.23
- space background now parallaxes instead of scrolling sideways
- added <a href="layouts/index.html">layouts page</a>
- added homestuck layout
- added 3d card js
- added nightcore &... slowercore? modes to audio player

# 18.8.23
- added some new fonts into my font cauldron...
- prettied up changelog
- <img width="16" src="assets/h.png" alt="h">
- mixed in some stuff with the link widgets. aka got sillay
- song player now displays position in playlist. also added "paramnesiac" by still crisp and "i feel like" by sockspace
- space background now scrolls with you
- there was like a whole other heap of index page changes but i rolled them all back because i preferred how it was actually

# 8.8.23
- some index tweaks..
- reorganized widgets a bit
- prettied up tunes widget
- track names now include the composer
- added cbox! yell at me

# 3.8.23
- added a "peek" button to tracks on the <a href="tunes/index.html">tunes page</a>, so you can now view them in jummbox!

# 1.8.23
- index page v5!!!
- now i gotta get all these other pages back up and running...
- added <a href="beepbox-webring/index.html">beepbox webring</a>

# 26.7.23
- gonna start using this again LOL
- linked <a href="ough/izutsumi.html">izutsumi shrine</a> on about page, also added some more images of... *dreamy sigh* her
- uploaded an <a href="ough/mob-psycho.html">mp100 page</a> i made when i was still watching mp100 but i never uploaded here for some reason. that one isn't linked anywhere though
- gregbutevil

# 17.4.23
- new about page design

# 9.4.23
- "lol what if i do a it again"
- (remade home page x2 combo)
- (well just styling mostly the layout is the same i guess)
- blog page is up (again)

# 7.3.23
- added some hidden links to the about me page

# 6.3.23
- some site buttons on the misc. page now display comments if you hover over them

# 5.3.23
- added JUICE launch countdown to about me page
- readded corkboard in the form of the misc. page

# 23.2.23
- redesigned about me page
- added new track to music page

# 15.2.23
- added about me page
- added sitemap
- added under construction page

# 10.2.23
- remade home page (yahoo!)`;

while (temp.includes("<a href=")) {
  let start = temp.lastIndexOf("<a href=");
  let end = temp.lastIndexOf("</a>") + 4;
  let link = temp.slice(start + 9, temp.indexOf("\"", start + 9));
  let text = temp.slice(start + 11 + link.length, end - 4);
  console.log(link, start, end);

  temp = temp.slice(0, start) + `[${text}](${link})` + temp.slice(end);
}


console.log(temp);