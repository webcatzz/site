// tabs.js by june @ webcatz.neocities.org

/*

how to use:

1. save the script to your site and link it in your page's head:
<script src="wherever/youre/storing/tabs.js"></script>

2. all you need to do is wrap your tabs in a <tab-div></tab-div>.
   to give the tabs names (displayed in the tab buttons), add a data-tab attribute.
	 otherwise, names will be auto-generated. (Tab 1, Tab 2, Tab 3, etc.)
<tab-div>
	<div data-tab="First">This is the first tab!</div>
	<div data-tab="Second">This is the second.</div>
	<div>And this is the third.</div>
</tab-div>

3. the tab bar and buttons will be automatically inserted.
   to style them, use the following classes:
.tab-bar (div that contains all tab buttons. default styling: {display: flex})
.tab-button
.active (applied to tab buttons whose tab is open)

you can add a tab="number" attribute to your <tab-div> to change the tab.

*/

class TabContainer extends HTMLElement {

	#tab = 0;
	get tab() {return this.#tab}
	set tab(value) {
		this.children[this.#tab + 1].style.display = "none";
		if (this.tabBar) this.tabBar.children[this.#tab].classList.remove("active");
		
		this.#tab = value;

		this.children[this.#tab + 1].style.display = "";
		if (this.tabBar) this.tabBar.children[this.#tab].classList.add("active");

		this.dispatchEvent(new Event("change"));
	}

	tabBar;

	connectedCallback() {
		this.tabBar = document.createElement("div");
		this.tabBar.className = "tab-bar";

		for (let i = 0; i < this.childElementCount; i++) {
			let tab = this.children[i];
			tab.style.display = "none";

			let tabButton = document.createElement("button");
			tabButton.className = "tab-button";
			tabButton.textContent = tab.dataset.tab ?? "Tab " + (i + 1);
			tabButton.onclick = () => this.tab = i;
			this.tabBar.appendChild(tabButton);
		}

		this.prepend(this.tabBar);
		this.tab = this.tab;
	}

	static observedAttributes = ["tab"];
	attributeChangedCallback(name, oldValue, value) {
		this.tab = Number(value);
	}

}

customElements.define("tab-div", TabContainer);

let style = new CSSStyleSheet;
style.replaceSync(`
tab-div {display: block}
.tab-bar {display: flex}
`);
document.adoptedStyleSheets.push(style);