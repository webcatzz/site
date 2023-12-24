// onionring.js is made up of four files - onionring-widget.js (this one!), onionring-index.js, onionring-variables.js and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (è’œ) house, last updated 2020-11-24

// === ONIONRING-WIDGET ===

var tag = document.getElementById("beepbox-webring");
thisSite = window.location.href;
thisIndex = null;
for (i = 0; i < sites.length; i++) {
  if (thisSite.startsWith(sites[i])) {
    thisIndex = i;
    break;
  }
}

if (thisIndex == null) {
  tag.insertAdjacentHTML('afterbegin', `<div style="color: #999; font-family: sans-serif; padding: 8px 16px; border: 4px solid #222; border-radius: 5px; background-color: black">this site isn't part of the the beepbox webring yet :(</div>`);
} else {
  previousIndex = (thisIndex-1 < 0) ? sites.length-1 : thisIndex-1;
  nextIndex = (thisIndex+1 >= sites.length) ? 0 : thisIndex+1;

  if (tag.hasAttribute("data-song")) {
    tag.insertAdjacentHTML("afterbegin", `
    <a class="beepbox-arrow" href="${sites[previousIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/left.png"></a>
    <div id="beepbox-main">
      <div>this site is part of the <a href="https://webcatz.neocities.org/beepbox-webring/">beepbox webring</a>!</div>
      <iframe id="beepbox-iframe" src="${tag.getAttribute("data-song")}"></iframe>
    </div>
    <a class="beepbox-arrow" href="${sites[nextIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/right.png"></a>
  `);
  } else {
    tag.insertAdjacentHTML("afterbegin", `
    <a class="beepbox-arrow" href="${sites[previousIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/left.png"></a>
    <div id="beepbox-main" class="beepbox-nosong">
      <div>this site is part of the <a href="https://webcatz.neocities.org/beepbox-webring/">beepbox webring</a>!</div>
      <div id="beepbox-bg"></div>
    </div>
    <a class="beepbox-arrow" href="${sites[nextIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/right.png"></a>
  `);
  }
}