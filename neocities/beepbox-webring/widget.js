let bpTag = document.getElementById("beepbox-webring");
let thisSite = location.href, thisIndex = sites.findIndex(url => thisSite.startsWith(url));

if (thisIndex == -1) bpTag.insertAdjacentHTML('afterbegin', `<div style="color: #999; font-family: sans-serif; padding: 8px 16px; border: 4px solid #222; border-radius: 5px; background-color: black">this site isn't part of the the beepbox webring yet :(</div>`);
else {
  previousIndex = (thisIndex-1 < 0) ? sites.length-1 : thisIndex-1;
  nextIndex = (thisIndex+1 >= sites.length) ? 0 : thisIndex+1;

  if (bpTag.hasAttribute("data-song")) bpTag.insertAdjacentHTML("afterbegin", `
    <a class="beepbox-arrow" href="${sites[previousIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/left.png" alt="left arrow"></a>
    <div id="beepbox-main">
      <div>this site is part of the <a href="https://webcatz.neocities.org/beepbox-webring/">beepbox webring</a>!</div>
      <iframe id="beepbox-iframe" src="${bpTag.getAttribute("data-song")}"></iframe>
    </div>
    <a class="beepbox-arrow" href="${sites[nextIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/right.png" alt="right arrow"></a>
  `);
  else bpTag.insertAdjacentHTML("afterbegin", `
    <a class="beepbox-arrow" href="${sites[previousIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/left.png" alt="left arrow"></a>
    <div id="beepbox-main" class="beepbox-nosong">
      <div>this site is part of the <a href="https://webcatz.neocities.org/beepbox-webring/">beepbox webring</a>!</div>
      <div id="beepbox-bg"></div>
    </div>
    <a class="beepbox-arrow" href="${sites[nextIndex]}"><img src="https://webcatz.neocities.org/beepbox-webring/right.png" alt="right arrow"></a>
  `);
}