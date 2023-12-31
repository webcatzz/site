var tag = document.getElementById("beepbox-webring");
thisSite = window.location.href, thisIndex = null;
for (i = 0; i < sites.length; i++) if (thisSite.startsWith(sites[i])) {thisIndex = i; break}

if (thisIndex == null) tag.insertAdjacentHTML('afterbegin', `<div style="color: #999; font-family: sans-serif; padding: 8px 16px; border: 4px solid #222; border-radius: 5px; background-color: black">this site isn't part of the the beepbox webring yet :(</div>`);
else {
  previousIndex = (thisIndex-1 < 0) ? sites.length-1 : thisIndex-1;
  nextIndex = (thisIndex+1 >= sites.length) ? 0 : thisIndex+1;
  tag.style.display = "flex";
  tag.insertAdjacentHTML("afterbegin", `
    <a href="${previousIndex}"><img src="https://webcatz.neocities.org/beepbox-webring/button-left.png" alt="left arrow"></a>
    <a href="https://webcatz.neocities.org/beepbox-webring/"><img src="https://webcatz.neocities.org/beepbox-webring/button.png" alt="beepbox webring"></a>
    <a href="${nextIndex}"><img src="https://webcatz.neocities.org/beepbox-webring/button-right.png" alt="right arrow"></a>
  `);
}