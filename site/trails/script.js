const wrapper = document.getElementById("title-wrapper");
const postcard = document.getElementById("banner");

addEventListener("scroll", () => {
	if (wrapper.getBoundingClientRect().bottom > 0) {
		postcard.style.top = scrollY * 0.33 + "px";
		postcard.style.rotate = scrollY * 0.005 + "deg";
	}
});