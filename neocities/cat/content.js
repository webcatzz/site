const content = document.querySelector("main");
Object.assign(content, {

	load: async pageName => {
		if (pageName === "") return content.replaceChildren("");

		let file = await fetch(pageName + ".html");
		let html = await file.text();
		content.innerHTML = html;

		document.title = "☾⋆⁺₊ " + (content.querySelector("h2")?.textContent ?? "cat comic...ᐟ");

		// scripts
		if (html.includes("<script>")) {
			let code = html.substring(html.lastIndexOf("<script>") + 8, html.lastIndexOf("</script>"));
			eval?.(code);
		}
	}

});


// url hash
onhashchange = () => content.load(location.hash ? location.hash.substring(1) : "");
onhashchange();


// refresh shorthand
function queueRefresh() {
	addEventListener("hashchange", () => location.reload(), {once: true});
}


// clouds
const clouds = document.getElementById("clouds");
onscroll = () => {
	let offset = -scrollY / 8;
	clouds.style.backgroundPositionX = `${offset}px, ${offset/3}px`;
}