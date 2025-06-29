// nav

function onItemClicked() {
	view.open(this.dataset.id);
}

for (const item of document.getElementsByClassName("nav-item")) {
	item.addEventListener("click", onItemClicked);
}

// xml

const view = document.getElementById("view");

view.open = async function (id) {
	let xml = await XML.fetch(`pages/${id}.xml`);
	this.innerHTML = `
		<header>
			<h2 id="view-title">${xml.get("name").text}</h2>
			<img id="view-line" src="assets/line.png" aria-hidden="true">
		</header>
		<main id="view-content">
			${xml.get("content").text}
		</main>
	`;
	for (const navItem of document.getElementsByClassName("nav-item"))
		navItem.classList.toggle("active", navItem.dataset.id === id);
	history.replaceState(null, "", "?page=" + id);
}

view.open(new URLSearchParams(location.search).get("page") ?? document.getElementsByClassName("nav-item")[0].dataset.id);