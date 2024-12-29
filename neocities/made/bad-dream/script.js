const main = document.querySelector("main");
const articles = main.getElementsByTagName("article");
const nav = document.querySelector("nav");

main.onscroll = () => {
	let i = -1;
	for (const article of articles) {
		i++;
		if (article.offsetTop + article.offsetHeight > main.scrollTop) break;
	}
	nav.getElementsByClassName("active")[0]?.classList.remove("active");
	nav.children[i].classList.add("active");
}

main.onscroll();