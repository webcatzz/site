// webstring by june @ webcatz.neocities.org

// webring settings
webring = {

  sites: [
    "https://your_site_here.neocities.org",
    "https://another_site.neocities.org",
  ],

  // PREV and NEXT get replaced with neighboring site urls
  widget: `
    <div id="my-webring" style="display: flex; gap: 8px">
      <a href="PREV">prev</a>
      <div>webring</div>
      <a href="NEXT">next</a>
    </div>
  `,

  error: "<div>This site isn't part of the webring yet.</div>",

};



// all of the actual code
webring.index = webring.sites.findIndex(url => location.href.startsWith(url));
if (webring.index == -1) document.currentScript.outerHTML = webring.error;
else {
  webring.widget = webring.widget.replace("PREV", webring.sites.at(webring.index - 1));
  webring.widget = webring.widget.replace("NEXT", webring.sites[webring.index + 1 % webring.sites.length]);
  document.currentScript.outerHTML = webring.widget;
}
delete webring;