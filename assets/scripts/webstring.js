// webstring by june @ juneish.neocities.org

{
	// sites in the ring
	let sites = [
		"https://example.com",
		"https://example.com",
	];
	// widget html
	// PREV and NEXT are replaced with neighbors' urls
	let widgets = {
		default: `<div id="my-webring" style="display: flex; gap: 8px">
			<a href="PREV">prev</a>
			<div>webring</div>
			<a href="NEXT">next</a>
		</div>`,
		error: `<div>this site isn't part of the webring yet</div>`,
	};
	// code
	let idx = sites.findIndex(site => location.href.startsWith(site));
	document.currentScript.outerHTML = idx === -1 ? widgets.error :
		(widgets[document.currentScript.dataset.widget] ?? widgets.default)
		.replace("PREV", sites.at(idx - 1))
		.replace("NEXT", sites[(idx + 1) % sites.length]);
}