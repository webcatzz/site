webring = {
	sites: [
		"https://webcatz.neocities.org",
		"https://kelprot.neocities.org",
		"https://murumart.neocities.org/m/beeps/",
		"https://troy-sucks.neocities.org/beepbox",
		"https://ninacti0n.neocities.org",
		"https://mikaorangeart.neocities.org",
		"https://robophobia.org",
		"https://fizzsea.neocities.org",
		"https://foggybear42.neocities.org",
		"https://mechagic.github.io",
		"https://sawtooth.neocities.org",
		"https://neovium.xyz/",
		"https://hellokittyminigun.neocities.org",
		"https://item64.neocities.org",
		"https://transferns.neocities.org",
		"https://teethinvitro.neocities.org/music",
	]
};


webring.idx = webring.sites.findIndex(url => location.href.startsWith(url));
if (webring.idx == -1) document.currentScript.outerHTML = "<a id=\"beepbox-webring\" href=\"https://webcatz.neocities.org/beepbox-webring/\"><img src=\"https://webcatz.neocities.org/beepbox-webring/button.png\" alt=\"beepbox webring\"></a>";
// song widget
else if (document.currentScript.dataset.song) {
	document.currentScript.outerHTML = `
		<div id="beepbox-webring">
			<a class="beepbox-arrow" target="_top" href="${webring.sites.at(webring.idx - 1)}"><img src="https://webcatz.neocities.org/beepbox-webring/left.png" alt="left arrow"></a>
			<div id="beepbox-main">
				<div>this site is part of the <a href="https://webcatz.neocities.org/beepbox-webring/">beepbox webring</a>!</div>
				<iframe src="${document.currentScript.dataset.song}"></iframe>
			</div>
			<a class="beepbox-arrow" target="_top" href="${webring.sites[(webring.idx + 1) % webring.sites.length]}"><img src="https://webcatz.neocities.org/beepbox-webring/right.png" alt="right arrow"></a>
		</div>
	`;
	let sheet = document.createElement("link");
	sheet.rel = "stylesheet";
	sheet.href = "https://webcatz.neocities.org/beepbox-webring/song.css";
	document.head.appendChild(sheet);
}
// button widget
else document.currentScript.outerHTML = `
	<div id="beepbox-webring" style="display: flex; justify-content: center; align-items: center; gap: 8px; image-rendering: pixelated">
		<a target="_top" href="${webring.sites.at(webring.idx - 1)}"><img src="https://webcatz.neocities.org/beepbox-webring/button-left.png" alt="prev"></a>
		<a href="https://webcatz.neocities.org/beepbox-webring/"><img src="https://webcatz.neocities.org/beepbox-webring/button.png" alt="beepbox webring"></a>
		<a target="_top" href="${webring.sites[(webring.idx + 1) % webring.sites.length]}"><img src="https://webcatz.neocities.org/beepbox-webring/button-right.png" alt="next"></a>
	</div>
`;