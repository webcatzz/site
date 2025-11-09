// scroll

if (!CSS.supports("animation-timeline", "view(block)")) {
	const nav = document.querySelector("nav");
	const scrollItems = nav.getElementsByTagName("a");
	nav.addEventListener("scroll", function () {
		for (let i = 2; i < scrollItems.length; i++) {
			let item = scrollItems[i];
			let percent = Math.min(1, Math.max(0, (item.offsetTop + item.offsetHeight / 2 - this.offsetTop - this.scrollTop) / this.offsetHeight));
			item.style.marginLeft = Math.max(percent * 203 - 32, 0) + "px";
			if (percent > 1) break;
		}
	});
	nav.dispatchEvent(new Event("scroll"));
}

// link redirect

let param;
if (param = new URLSearchParams(location.search).get("page")) location.replace(param + ".html");