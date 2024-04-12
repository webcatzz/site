// setup
const corkboard = document.getElementById("corkboard");
var target, offsetX, offsetY, z = 1, heldLink, dragged;
for (const el of corkboard.children) el.onmousedown = startDrag;
for (const img of corkboard.getElementsByTagName("img")) img.setAttribute("draggable", "false");
for (const a of corkboard.getElementsByTagName("a")) a.setAttribute("draggable", "false");

// dragging
function startDrag(e) {
  if (e.target.tagName === "A") heldLink = e.target;
  target = this;
	offsetX = e.x - this.offsetLeft;
	offsetY = e.y - this.offsetTop;
	this.style.zIndex = ++z;
  e.stopPropagation();

	addEventListener("mousemove", drag);
	addEventListener("mouseup", endDrag, {once: true});
}
function drag(e) {
	target.style.left = e.x - offsetX + "px";
	target.style.top = e.y - offsetY + "px";
  if (heldLink && !dragged) {
    heldLink.addEventListener("click", e => e.preventDefault(), {once: true});
    heldLink = null, dragged = true;
  }
}
function endDrag() {
	removeEventListener("mousemove", drag);
  if (target.classList.contains("gravity")) drop(target);
	target = null;
  dragged = false;
}
function drop(el) {
	target = null;
	let targetY = window.innerHeight - el.offsetHeight - 16;
	let dY = el.offsetWidth / 100;
	let prevTimestamp;
	requestAnimationFrame(dropAnim);

	function dropAnim(timestamp) {
		if (prevTimestamp === undefined) prevTimestamp = timestamp;
		let elapsed = timestamp - prevTimestamp;

		if (el.offsetTop < targetY && el != target) {
			el.style.top = Math.min(el.offsetTop + dY, targetY) + "px";
			dY *= 1.25;

			prevTimestamp = timestamp;
			requestAnimationFrame(dropAnim);
		}
	}
}

// site comments
const siteComment = document.getElementById("comment-area");
document.getElementById("sites").onmouseover = event => {
  let link = event.target.parentElement;
  if (link.tagName == "A") {
    if (link.title) siteComment.textContent = link.title;
    else siteComment.textContent = "[none...]";
    if (link.classList.contains("friend")) siteComment.innerHTML += " <span class=\"comment-friend\">(friend <3)</span>";
  }
}
document.getElementById("sites").onmouseleave = () => siteComment.textContent = "[hover over a button!]";

// video tapes
const wrapper = document.getElementById("corkboard"), tv = document.getElementById("tv-wrapper"), tvIframe = document.getElementById("tv").querySelector("iframe");
tvIframe.src = "";
new Audio("https://files.catbox.moe/4gff8o.mp3");
for (const tape of document.getElementsByClassName("tape")) tape.addEventListener("mouseup", dropTape);
function dropTape(e) {
  if (inBounds(e.x - wrapper.offsetLeft, e.y - wrapper.offsetTop, tv.offsetLeft, tv.offsetLeft + tv.offsetWidth, tv.offsetTop, tv.offsetTop + tv.offsetHeight)) {
    let src = target.dataset.src;
    e.target.remove();
    tvIframe.src = "";
    tv.classList.add("loading");
    let sfx = new Audio("https://files.catbox.moe/4gff8o.mp3");
    sfx.onended = () => {
      tv.classList.remove("loading");
      tvIframe.src = "https://www.youtube-nocookie.com/embed/" + src + "?autoplay=1";
    }
    sfx.play();
  }
  function inBounds(x, y, minX, maxX, minY, maxY) {return x > minX && x < maxX && y > minY && y < maxY}
}