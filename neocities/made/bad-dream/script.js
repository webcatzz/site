const wrapper = document.getElementById("wrapper");
const articles = wrapper.getElementsByTagName("article");
const nav = document.querySelector("nav");

wrapper.onscroll = () => {
	let i = -1;
	for (const article of articles) {
		if (article.offsetTop > wrapper.scrollTop + wrapper.offsetHeight) break;
		i++;
	}
	nav.getElementsByClassName("active")[0]?.classList.remove("active");
	nav.children[i].classList.add("active");
}