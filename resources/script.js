for (const item of document.getElementsByClassName("nav-item")) {
	if (item.href.startsWith(location.href)) {
		item.classList.add("active");
		break;
	}
}