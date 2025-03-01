webring = {
	sites: [
		"https://juneish.neocities.org",
		"https://kelprot.neocities.org",
		"https://murumart.neocities.org/m/beeps/",
		"https://troy-sucks.neocities.org/beepbox",
		"https://ninacti0n.art",
		"https://mikaorangeart.neocities.org",
		"https://robophobia.org",
		"https://fizzsea.neocities.org",
		"https://foggybear42.neocities.org",
		"https://mechagic.party",
		"https://sawtooth.neocities.org",
		"https://zekere.xyz",
		"https://hellokittyminigun.neocities.org",
		"https://item64.neocities.org",
		"https://transferns.neocities.org",
		"https://teethinvitro.neocities.org/music",
		"https://gleefulpebble.neocities.org",
		"https://alan460.is-hella.gay",
		"https://swiftred.neocities.org",
	]
};


webring.idx = webring.sites.findIndex(url => location.href.startsWith(url));
if (webring.idx == -1) document.currentScript.outerHTML = "<a id=\"beepbox-webring\" href=\"https://juneish.neocities.org/ring/beepbox/\"><img src=\"https://juneish.neocities.org/ring/beepbox/_asset/button.png\" alt=\"beepbox webring\"></a>";
// song widget
else if (document.currentScript.dataset.song) {
	document.currentScript.outerHTML = `
		<div id="beepbox-webring">
			<a class="beepbox-arrow" target="_top" href="${webring.sites.at(webring.idx - 1)}"><img src="https://juneish.neocities.org/ring/beepbox/_asset/song-left.png" alt="left arrow"></a>
			<div id="beepbox-main">
				<div>this site is part of the <a href="https://juneish.neocities.org/ring/beepbox/">beepbox webring</a>!</div>
				<iframe src="${document.currentScript.dataset.song}"></iframe>
			</div>
			<a class="beepbox-arrow" target="_top" href="${webring.sites[(webring.idx + 1) % webring.sites.length]}"><img src="https://juneish.neocities.org/ring/beepbox/_asset/song-right.png" alt="right arrow"></a>
		</div>
	`;
	let sheet = document.createElement("link");
	sheet.rel = "stylesheet";
	sheet.href = "https://juneish.neocities.org/ring/beepbox/song.css";
	document.head.appendChild(sheet);
}
// button widget
else document.currentScript.outerHTML = `
	<div id="beepbox-webring" style="display: flex; justify-content: center; align-items: center; gap: 8px; image-rendering: pixelated">
		<a target="_top" href="${webring.sites.at(webring.idx - 1)}"><img src="https://juneish.neocities.org/ring/beepbox/_asset/button-left.png" alt="prev"></a>
		<a href="https://juneish.neocities.org/ring/beepbox/"><img src="https://juneish.neocities.org/ring/beepbox/_asset/button.png" alt="beepbox webring"></a>
		<a target="_top" href="${webring.sites[(webring.idx + 1) % webring.sites.length]}"><img src="https://juneish.neocities.org/ring/beepbox/_asset/button-right.png" alt="next"></a>
	</div>
`;