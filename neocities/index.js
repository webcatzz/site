// keychain

const keychain = document.getElementById("keychain");
const keyNum = keychain.childElementCount - 1;
const keySep = 22.5;

for (let i = 0, angle = (keyNum + 1) * keySep * 0.5; i < keyNum; i++) {
	let a = keychain.children[i];
	a.style.rotate = (angle -= keySep) + "deg";
	
	if (i < keyNum / 2) {
		let span = document.createElement("span");
		span.textContent = a.textContent;
		a.replaceChildren(span);
	}
}



// lastfm

fetch("https://lastfm-last-played.biancarosa.com.br/web-catz/latest-song").then(res => res.json()).then(json => {
	if (json.track["@attr"]?.nowplaying) {
		document.getElementById("lastfm-cover").src = json.track.image[1]["#text"];
		document.getElementById("lastfm-track").textContent = json.track.name;
		document.getElementById("lastfm-track").title = json.track.name;
		document.getElementById("lastfm-artist").textContent = json.track.artist["#text"];
		document.getElementById("lastfm-artist").title = json.track.artist["#text"];
	} else {
		document.getElementById("lastfm-artist").textContent = "nothing's on.";
	}
});



// snow

const snowflakes = document.getElementById("snowflakes");
var time = 0;

setInterval(() => {

	if (time % 2000 == 0) {
		let snowflake = snowflakes.appendChild(document.createElement("img"));
		snowflake.className = "snowflake";
		snowflake.style.left = (Math.random() * snowflakes.offsetWidth) + "px";
	}

	for (const snowflake of snowflakes.children) {
		snowflake.style.top = snowflake.offsetTop + 1 + "px";
		snowflake.style.marginLeft = Math.sin(snowflake.offsetTop / 32) * 32 + "px";

		if (snowflake.offsetTop > document.body.offsetTop + document.body.offsetHeight) {
			snowflake.remove();
		}
	}

	time += 100;

}, 25);