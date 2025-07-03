// webstring by june @ juneish.neocities.org

{
	let webring = {
		// sites in the ring
		sites: [
			"https://example.com",
			"https://example.com",
		],
		// widget html
		// PREV and NEXT are replaced with neighbors' urls
		widgets: {
			default: `<div id="my-webring" style="display: flex; gap: 8px">
				<a href="PREV">prev</a>
				<div>webring</div>
				<a href="NEXT">next</a>
			</div>`,
			error: `<div>this site isn't part of the webring yet</div>`,
		},
	};
	// code
	webring.idx = webring.sites.findIndex(site => location.href.startsWith(site));
	document.currentScript.outerHTML = webring.idx === -1 ? webring.widgets.error :
		(webring.widgets[document.currentScript.dataset.widget] ?? webring.widgets.default)
		.replace("PREV", webring.sites.at(webring.idx - 1))
		.replace("NEXT", webring.sites[(webring.idx + 1) % webring.sites.length]);
}