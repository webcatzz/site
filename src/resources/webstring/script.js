// settings object

document.getElementById("settings-object").innerHTML = hljs.highlight(
  document.getElementById("settings-object").textContent,
  {language: "js"}
).value;



// customizer

document.getElementById("summon").onclick = function () {
  let settings = {};
  for (const key of ["random", "stylesheet", "multiwidget"]) settings[key] = document.getElementById(key).checked;
  // displaying script
  let view = document.getElementById("script");
  view.innerHTML = getScript(settings);
  view.animate({transform: ["translateY(0.5em)", "none"]}, {duration: 300, easing: "ease-out"});
  document.getElementById("wizard").animate({transform: ["translateY(-0.5em)", "none"]}, {duration: 300, easing: "ease-out"});
  // notes
  let notes = document.getElementById("notes");
  if (settings.multiwidget) {
    notes.innerHTML = `<p><b>adding multiple widgets?</b> when you're adding the widget to a page, choose which widget to display by setting <code>data-widget</code> to the name of the preferred widget:</p>
    <pre><span class="tag">&lt;</span><span class="tag-name">script</span> <span class="attr">data-widget</span>=<span class="string">"widgetname"</span> <span class="attr">src</span>=<span class="string">"https://your_site_here.neocities.org/folder/webstring.js"</span><span class="tag">>&lt;/<span class="tag-name">script</span>></span></pre>
    <p>if no <code>data-widget</code> is found, the first widget is displayed.</p>`;
    notes.classList.remove("hidden");
  }
  else {
    notes.classList.add("hidden");
    notes.textContent = "";
  }
}


function getScript(settings = {}) {
  return hljs.highlight(`// webstring by june @ webcatz.neocities.org

// webring settings
webring = {

  // list of sites in the ring
  sites: [
    "https://your_site_here.neocities.org",
    "https://another_site.neocities.org",
  ],

  // html inserted as your widget
  // PREV and NEXT get replaced with neighboring site urls
  ${settings.multiwidget ? `widgets: {
    default: \`
      <div style="display: flex; gap: 8px">
        <a href="PREV">prev</a>
        <div>webring</div>${insertIf(settings.random, `
        <a href="RANDOM">random</a>`)}
        <a href="NEXT">next</a>
      </div>
    \`,
    another: \`
      <div>another widget...</div>
    \`,
    yet_another: \`
      <div>add as many (or as few) as you like!</div>
    \`,
  }` : `widget: \`
    <div id="my-webring" style="display: flex; gap: 8px">
      <a href="PREV">prev</a>
      <div>webring</div>${insertIf(settings.random, `
      <a href="RANDOM">random</a>`)}
      <a href="NEXT">next</a>
    </div>
  \``},${insertIf(settings.stylesheet, `

  // widget css
  stylesheet: "https://your_site_here.neocities.org/folder/widget.css",`)}

  // html inserted instead of your widget on sites that aren't in the ring
  error: "<div>This site isn't part of the webring yet.</div>",

};



// code
webring.index = location.href.startsWith("file://") ? 0 : webring.sites.findIndex(url => location.href.startsWith(url));
if (webring.index === -1) document.currentScript.outerHTML = webring.error;
else {${insertIf(settings.stylesheet, `
  let sheet = document.createElement("link");
  sheet.rel = "stylesheet", sheet.href = webring.stylesheet;
  document.head.appendChild(sheet);`)}
  ${!settings.multiwidget ? `webring.widget = webring.widget.replace("PREV", webring.sites.at(webring.index - 1));
  webring.widget = webring.widget.replace("NEXT", webring.sites[(webring.index + 1) % webring.sites.length]);${insertIf(settings.random, `
  webring.widget = webring.widget.replace("RANDOM", webring.sites[Math.floor(Math.random() * webring.sites.length)]);`)}
  document.currentScript.outerHTML = webring.widget;` : `let widget = webring.widgets[document.currentScript.dataset.widget] ?? webring.widgets[Object.keys(webring.widgets)[0]];
  widget = widget.replace("PREV", webring.sites.at(webring.index - 1));
  widget = widget.replace("NEXT", webring.sites[(webring.index + 1) % webring.sites.length]);${insertIf(settings.random, `
  widget = widget.replace("RANDOM", webring.sites[Math.floor(Math.random() * webring.sites.length)]);`)}
  document.currentScript.outerHTML = widget;`}
}
delete webring;`, {language: "js", ignoreIllegals: true}).value;

  function insertIf(condition, text) {
    return condition ? text : "";
  }
}