let locHref = location.href.endsWith(".html") ? location.href.slice(0, -5) : location.href;
for (const item of document.getElementsByClassName("nav-item")) {
	if (locHref === (item.href.endsWith(".html") ? item.href.slice(0, -5) : item.href)) {
		item.classList.add("active");
		break;
	}
}