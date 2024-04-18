const poems = [
	"orpheus",
	"haiku he was cursed by an evil wizard to write",
	"walled garden",
	"dog",
	"an empty easel",
	"recursive space",
	"like all her little cranes, she's all folded down",
]


async function leafTo(idx) {
	idx = (idx - 1) * 2;
	write(poems[idx], "left");
	if (idx + 1 != poems.length) write(poems[idx + 1], "right");
	else document.getElementById("right").textContent = "";

	buttonLeft.disabled = idx == 0;
	buttonRight.disabled = idx + 2 >= poems.length;
	
	async function write(poem, page) {
		page = document.getElementById(page);
		page.textContent = "";

		let file = await fetch("txt/" + poem + ".txt");
		file = await file.text();

		let dateIdx = file.indexOf("-");
		let bodyIdx = file.indexOf("\n", dateIdx);
		let bgn = file.substring(0, dateIdx - 1);
		let pub = file.substring(dateIdx + 2, bodyIdx);
		let text = file.substring(bodyIdx + 2);

		page.innerHTML = `
			<h2>${poem}</h2>
			<div class="date bgn">bgn. ${bgn}</div>
			<div class="date pub">pub. ${pub}</div>
			<pre>${text}</pre>
		`;
	}

}

const buttonLeft = document.getElementById("prev");
const buttonRight = document.getElementById("next");
var page = 1;

leafTo(page);
buttonLeft.onclick = () => leafTo(--page);
buttonRight.onclick = () => leafTo(++page);