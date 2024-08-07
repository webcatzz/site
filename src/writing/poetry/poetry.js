const poems = [
	"sonny boy",
	"one of those",
	"haiku he was cursed by an evil wizard to write",
	"walled garden",
	"dog",
	"an empty easel",
	"recursive space",
	"little cranes",
	"astronaut",
]


function leafTo(idx) {
	idx = (idx - 1) * 2;
	write(poems[idx], "left");
	if (idx + 1 !== poems.length) write(poems[idx + 1], "right");
	else document.getElementById("right").textContent = "";

	buttonLeft.disabled = idx === 0;
	buttonRight.disabled = idx + 2 >= poems.length;
}

async function write(poem, page) {
	page = document.getElementById(page);
	page.textContent = "";

	let file = await fetch("_txt/" + poem + ".txt");
	file = await file.text();

	let splitIdx = file.indexOf("\n");
	let date = file.substring(0, splitIdx);
	let text = file.substring(splitIdx).trimStart();

	page.innerHTML = `
		<h2>${poem}</h2>
		<div class="date">pub. ${date}</div>
		<pre>${text}</pre>
	`;
}

const buttonLeft = document.getElementById("prev");
const buttonRight = document.getElementById("next");
var page = 1;

leafTo(page);
buttonLeft.onclick = () => leafTo(--page);
buttonRight.onclick = () => leafTo(++page);