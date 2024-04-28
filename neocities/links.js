// dropping
for (const el of document.getElementById("corkboard").children) {
	if (el.classList.contains("gravity")) el.addEventListener("dragend", drop);
}

function drop() {
	let targetY = window.innerHeight - this.offsetHeight - 16;
	let dY = this.offsetWidth / 100;

	let el = this;
	requestAnimationFrame(dropAnim);
	function dropAnim(timestamp) {
		if (el.offsetTop < targetY && el != Drag.active) {
			el.style.top = Math.min(el.offsetTop + dY, targetY) + "px";
			dY *= 1.25;
			requestAnimationFrame(dropAnim);
		}
	}
}


// video tapes
const wrapper = document.getElementById("corkboard");
const tv = document.getElementById("tv-wrapper");
const tvIframe = document.getElementById("tv").querySelector("iframe");

tvIframe.src = "";
new Audio("https://files.catbox.moe/4gff8o.mp3");

for (const tape of document.getElementsByClassName("tape")) tape.addEventListener("dragend", dropTape);

function dropTape(e) {
	if (inBounds(e.x - wrapper.offsetLeft, e.y - wrapper.offsetTop, tv.offsetLeft, tv.offsetLeft + tv.offsetWidth, tv.offsetTop, tv.offsetTop + tv.offsetHeight)) {
		let src = this.dataset.src;
		this.remove();

    tvIframe.src = "";
    tv.classList.add("loading");
    let sfx = new Audio("https://files.catbox.moe/4gff8o.mp3");
    sfx.onended = () => {
      tv.classList.remove("loading");
      tvIframe.src = "https://www.youtube-nocookie.com/embed/" + src + (src.includes("?") ? "&" : "?") + "autoplay=1";
    }
    sfx.play();
	}

	function inBounds(x, y, minX, maxX, minY, maxY) {return x > minX && x < maxX && y > minY && y < maxY}
}