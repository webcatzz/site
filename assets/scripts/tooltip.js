const tooltip = Object.assign(document.createElement("div"), {

	show(el, text) {
		this.textContent = text;
		let rect = el.getBoundingClientRect();
		this.style.left = rect.left + rect.width / 2 + "px";
		this.style.top = rect.top + rect.height + "px";
		document.body.appendChild(this);
	},

	hide() {
		this.remove();
	},

	add(el, text) {
		el.addEventListener("mouseenter", () => this.show(el, text));
		el.addEventListener("mouseexit", () => this.hide());
	},

	addAllWithTitle(els = document.body.children) {
		for (const el of els) {
			if (el.title) {
				this.add(el, el.title);
				el.removeAttribute("title");
			}
			this.addAllWithTitle(el.children);
		}
	},

});

tooltip.classList.add("tooltip");
tooltip.style.position = "fixed";
tooltip.style.zIndex = 10;
tooltip.style.pointerEvents = "none";