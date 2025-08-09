// button widget

document.querySelector("#button-widget button").addEventListener("click", () => {
	navigator.clipboard.writeText("<script src=\"https://juneish.neocities.org/ring/beepbox/ring.js\"></script>");
});

// song widget

const input = document.querySelector("#song-widget input");
const embed = document.querySelector("#song-widget iframe");
const defaultSong = embed.src;

input.onInput = () => embed.src = input.value ? input.value : defaultSong;
input.addEventListener("input", input.onInput);
input.onInput();

document.querySelector("#song-widget button").addEventListener("click", () => {
	navigator.clipboard.writeText(`<script defer src="https://juneish.neocities.org/ring/beepbox/ring.js" data-song="${input.value}"></script>`);
});