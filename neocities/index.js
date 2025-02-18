// lastfm

fetch("https://lastfm-last-played.biancarosa.com.br/web-catz/latest-song").then(res => res.json()).then(json => {
	if (json.track["@attr"]?.nowplaying) {
		document.getElementById("lastfm").textContent = json.track.name.toLowerCase() + " - " + json.track.artist["#text"].toLowerCase();
	}
});