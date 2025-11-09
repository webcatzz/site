const poems = [
	"skittering",
	"um",
	"sonny boy",
	"haiku he was cursed by an evil wizard to write",
	"walled garden",
	"dog",
	"an empty easel",
	"recursive space",
	"little cranes",
	"astronaut",
];

const pageLeft = document.getElementById("left");
const pageRight = document.getElementById("right");
const buttonLeft = document.getElementById("prev");
const buttonRight = document.getElementById("next");

async function loadPage(idx, el) {
	let xml = await XML.fetch(`pages/${poems[idx]}.xml`);
	el.innerHTML = `
		<hgroup>
			<h2>${xml.get("name")?.text ?? ""}</h2>
			<p>${xml.get("date")?.text ?? ""}</p>
		</hgroup>
		<main>
			${xml.get("text").text}
		</main>
	`;
}

function leafTo(idx) {
	pageRight.textContent = "";
	loadPage(idx, pageLeft);
	loadPage(idx + 1, pageRight);
	buttonLeft.disabled = idx == 0;
	buttonRight.disabled = idx + 2 >= poems.length;
}

let idx = 0;
buttonLeft.addEventListener("click", () => leafTo(idx -= 2));
buttonRight.addEventListener("click", () => leafTo(idx += 2));

leafTo(0);