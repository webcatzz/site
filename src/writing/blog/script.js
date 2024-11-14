// buttons

for (const button of document.querySelectorAll("#index button")) {
	button.onclick = onEntryButtonClicked;
	button.title = button.lastChild.data.trim();
}

function onEntryButtonClicked() {
	showEntry(this.dataset.entry);
	entryWrapper.scrollTo(0, 0);
}



// showing entry

const entryWrapper = document.getElementById("entry");
const entryTemplate = document.getElementById("entry-template");

async function showEntry(name) {
	let el;

	try {
		let entry = await fetchEntry(name);
		el = entryTemplate.content.cloneNode(true);

		el.getElementById("name").textContent = entry.name;

		el.getElementById("date").textContent = new Date(entry.date).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "2-digit"}).toLowerCase();
		el.getElementById("date").dateTime = entry.date;

		el.getElementById("content").innerHTML = entry.content;
		el.getElementById("content").className = entry.class;

		if (entry.mood) {
			el.getElementById("mood").firstChild.src = `_emote/${entry.mood}.png`;
			el.getElementById("mood").prepend(entry.mood + " ");
		}
		else el.getElementById("mood").parentElement.remove();

		el.getElementById("src").href = entryPath(name);
	}
	catch {
		el = document.createElement("iframe");
		el.style = "width: 100%; height: 100%";
		el.src = entryPath(name);
		entryWrapper.className = "";
	}

	history.replaceState(null, "", "?entry=" + name);
	entryWrapper.replaceChildren(el);
}



// xml parsing

let parser = new DOMParser;

async function fetchEntry(name) {
	let text = await (await fetch(entryPath(name))).text();
	let root = parser.parseFromString(text, "text/xml").documentElement;

	let entry = {class: root.querySelector("content").className};
	for (const tag of root.children) {
		entry[tag.tagName] = tag.innerHTML;
	}
	return entry;
}

function entryPath(name) {
	return `_entry/${name}.xml`;
}



// url

showEntry(new URLSearchParams(location.search).get("entry") ?? document.querySelector("#index button").dataset.entry);



// background

let background = [
	{path: "aquarium.jpg", artist: "lacecap", link: "miffy.carrd.co"},
	{path: "bed.png", artist: "peevishpants", link: "theweiweixu.carrd.co"},
	{path: "bridge.jpg", artist: "mochipanko", link: "mochipanko.tumblr.com"},
][Math.floor(Math.random() * 3)];

document.body.style.setProperty("--background", `url(_asset/background/${background.path})`);
document.getElementById("background-credit").textContent = "background by " + background.artist;
document.getElementById("background-credit").href = "https://" + background.link;



// meow

function meow() {
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/meow.mp3").play();
}