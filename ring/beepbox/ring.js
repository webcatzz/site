// webstring by june @ juneish.neocities.org

{
	// sites in the ring
	let sites = [
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
		"https://atarax.neocities.org",
		"https://ihatetehbsod.neocities.org",
		"https://bailey.lockheart.love",
	];
	// widget html
	// PREV and NEXT are replaced with neighbors' urls
	let widgets = {
		default: `
			<div id="beepbox-webring" style="display: flex; justify-content: center; align-items: center; gap: 8px; image-rendering: pixelated">
				<a href="PREV" rel="prev" target="_top"><img src="https://juneish.neocities.org/ring/beepbox/assets/button_left.png" alt="previous site"></a>
				<a href="https://juneish.neocities.org/ring/beepbox/" target="_top"><img src="https://juneish.neocities.org/ring/beepbox/assets/button.png" alt="beepbox webring"></a>
				<a href="NEXT" rel="next" target="_top"><img src="https://juneish.neocities.org/ring/beepbox/assets/button_right.png" alt="next site"></a>
			</div>
		`,
		song: `
			<style>
				#beepbox-webring {display: flex; align-items: center; gap: 0.5em; color: #999; font: 0.875em/1.1 sans-serif; text-align: center}
				#beepbox-main {display: flex; flex-direction: column; gap: 0.5em; background-color: black; padding: 0.5em 0.75em; border: 4px solid #222; border-radius: 5px; flex: 1}
				#beepbox-main a {color: #98f; font-weight: bold; text-decoration: underline}
				#beepbox-main iframe {width: 100%; height: 64px; border: none}
				.beepbox-arrow {background-color: #444; padding: 8px; border-radius: 5px}
				.beepbox-arrow:hover {background: #555}
				.beepbox-arrow img {display: block; width: 0.875em}
			</style>
			<div id="beepbox-webring">
				<a class="beepbox-arrow" href="PREV" rel="prev" target="_top"><img src="https://juneish.neocities.org/ring/beepbox/assets/song_left.png" alt="previous site"></a>
				<div id="beepbox-main">
					<div>this site is part of the <a href="https://juneish.neocities.org/ring/beepbox/" target="_top">beepbox webring</a>!</div>
					<iframe src="${document.currentScript.dataset.song}"></iframe>
				</div>
				<a class="beepbox-arrow" href="NEXT" rel="next" target="_top"><img src="https://juneish.neocities.org/ring/beepbox/assets/song_right.png" alt="next site"></a>
			</div>
		`,
	};
	// code
	let idx = sites.findIndex(site => location.href.startsWith(site));
	document.currentScript.outerHTML = (document.currentScript.dataset.song ? widgets.song : widgets.default)
		.replace("PREV", sites[(idx - 1 + sites.length) % sites.length])
		.replace("NEXT", sites[(idx + 1) % sites.length]);
}