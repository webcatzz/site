// nav

const nav = document.querySelector("nav");
const linkNum = nav.childElementCount - 1;
const linkSep = 22.5;

for (let i = 0, angle = (linkNum + 1) * linkSep * 0.5; i < linkNum; i++) {
	let a = nav.children[i];
	a.style.rotate = (angle -= linkSep) + "deg";
	
	if (i < linkNum / 2) {
		let span = document.createElement("span");
		span.textContent = a.textContent;
		a.replaceChildren(span);
	}
}



// lastfm

fetch("https://lastfm-last-played.biancarosa.com.br/web-catz/latest-song").then(res => res.json()).then(json => {
	if (json.track["@attr"]?.nowplaying) {
		document.getElementById("lastfm").textContent = json.track.name.toLowerCase() + " - " + json.track.artist["#text"].toLowerCase();
	}
});