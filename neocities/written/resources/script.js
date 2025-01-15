// xml

XML.template = page => `
	<header>
		<h1>${page.name}</h1>
		<img src="_asset/emphasis.png" aria-hidden="true">
	</header>
	<main>${page.content}</main>
`;
XML.nav(document.querySelector("article"), document.querySelectorAll("nav button"));



// active button

var active;

function onButtonMouseDown() {
	if (active) active.classList.remove("active");
}

function onButtonClicked() {
	active = this;
	active.classList.add("active");
}

for (const button of document.querySelectorAll("nav button")) {
	button.addEventListener("mousedown", onButtonMouseDown);
	button.addEventListener("click", onButtonClicked);

	if (button.dataset.page == XML.params.get("page")) {
		button.click();
	}
}



// code blocks

class CodeBlock extends HTMLElement {
	connectedCallback() {
		let copyBtn = document.createElement("button");
		copyBtn.className = "copy-button";
		copyBtn.title = "copy";
		copyBtn.onclick = () => navigator.clipboard.writeText(this.textContent);
		this.prepend(copyBtn);
	}
}

customElements.define("code-block", CodeBlock);