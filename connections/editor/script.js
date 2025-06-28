const grid = document.getElementById("grid");

// term

class Term extends HTMLElement {

	x; y;
	drag;

	constructor() {
		super();
		this.classList.add("term");
		this.addEventListener("mousedown", this.onMouseDown);
		this.addEventListener("click", this.onClick);
		this.addEventListener("blur", this.onBlur);
	}

	move(x, y) {
		this.style.left = x * (this.offsetWidth + 8) + "px";
		this.style.top = y * (this.offsetHeight + 8) + "px";
	}

	getInset(x, y) {
		let rect = grid.getBoundingClientRect();
		return {
			x: x - this.offsetWidth / 2 - rect.left,
			y: y - this.offsetHeight / 2 - rect.top,
		};
	}

	onMouseDown() {
		addEventListener("mousemove", this.drag = e => this.onDragMove(e));
		addEventListener("mouseup", e => this.onDragEnd(e), {once: true});
	}

	onDragMove(e) {
		let inset = this.getInset(e.x, e.y);
		this.style.left = inset.x + "px";
		this.style.top = inset.y + "px";
	}

	onDragEnd(e) {
		removeEventListener("mousemove", this.drag);
		this.drag = null;
		let inset = this.getInset(e.x, e.y);
		this.move(
			Math.round(inset.x / grid.offsetWidth * 4),
			Math.round(inset.y / grid.offsetHeight * 4),
		);
	}

	onClick() {
		this.contentEditable = true;
	}

	onBlur() {
		this.contentEditable = false;
	}

}

customElements.define("c-term", Term);

// grid

for (let i = 0; i < 16; i++) {
	let term = grid.appendChild(new Term);
	term.move(i % 4, Math.floor(i / 4));
}