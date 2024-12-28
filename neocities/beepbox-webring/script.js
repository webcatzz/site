// members

const list = document.getElementById("memberlist");

for (const site of webring.sites) {
	let link = list.appendChild(document.createElement("li")).appendChild(document.createElement("a"));
	link.href = site;
	link.textContent = new URL(site).hostname;
}



// button

document.querySelector("#button-widget button").onclick = () => {
	navigator.clipboard.writeText("<script src=\"https://juneish.neocities.org/ring.js\"></script>");
}



// song

const input = document.querySelector("#song-widget input");
const defaultSong = document.querySelector("#song-widget iframe").src;

input.oninput = () => {
	document.querySelector("#song-widget iframe").src = input.value ? input.value : defaultSong;
}

document.querySelector("#song-widget button").onclick = () => {
	navigator.clipboard.writeText(`<script defer src="https://juneish.neocities.org/ring.js" data-song="${input.value}"></script>`);
}

input.oninput();