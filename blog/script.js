// scroll

const nav = document.querySelector("nav");

nav.updateScroll = function () {
	for (let child = this.children[1]; child; child = child.nextElementSibling) {
		let percent = Math.min(1, Math.max(0, (child.offsetTop + child.offsetHeight / 2 - this.offsetTop - this.scrollTop) / this.offsetHeight));
		child.style.marginLeft = percent * 185 - 24 + "px";
		if (percent > 1) break;
	}
}

nav.addEventListener("scroll", nav.updateScroll);
nav.updateScroll();

// link redirect

let param;
if (param = new URLSearchParams(location.search).get("page")) location.replace(param + ".html");