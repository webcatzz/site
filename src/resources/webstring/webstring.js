// webstring by june @ webcatz.neocities.org

// settings
webring = {

	// list of sites in the ring
	sites: [
		"https://your_site_here.neocities.org",
		"https://another_site.neocities.org",
	],

	// html inserted as your widget
	// PREV and NEXT get replaced with neighboring site urls
	widget: `
		<div id="my-webring" style="display: flex; gap: 8px">
			<a href="PREV">prev</a>
			<div>webring</div>
			<a href="NEXT">next</a>
		</div>
	`,

	// html inserted instead of your widget on sites that aren't in the ring
	error: "<div>This site isn't part of the webring yet.</div>",

};



// code
webring.index = location.href.startsWith("file://") ? 0 : webring.sites.findIndex(url => location.href.startsWith(url));
if (webring.index === -1) document.currentScript.outerHTML = webring.error;
else {
	webring.widget = webring.widget.replace("PREV", webring.sites.at(webring.index - 1));
	webring.widget = webring.widget.replace("NEXT", webring.sites[(webring.index + 1) % webring.sites.length]);
	document.currentScript.outerHTML = webring.widget;
}
delete webring;