const nav = document.getElementById("post-nav");
const scrollItems = nav.querySelectorAll("& > ul > li");
nav.addEventListener("scroll", function () {
	for (let i = 0; i < scrollItems.length; i++) {
		let item = scrollItems[i];
		let percent = Math.min(1, Math.max(0, (item.offsetTop + item.offsetHeight / 2 - this.offsetTop - this.scrollTop) / this.offsetHeight));
		item.style.marginLeft = Math.max(percent * 203 - 64, 0) + "px";
		if (percent > 1) break;
	}
});
nav.dispatchEvent(new Event("scroll"));