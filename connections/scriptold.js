// game

const game = {

	categories: [],
	terms: [],
	
	selected: [],
	guesses: [],
	lives: Array.from(document.getElementsByClassName("life")),

	// grid

	move(obj, i, swap = true) {
		if (swap) this.move(this.terms[i], this.terms.indexOf(obj), false);
		this.terms[i] = obj;
		obj.style.left = (i % 4) * (obj.offsetWidth + 8) + "px";
		obj.style.top = Math.floor(i / 4) * (obj.offsetHeight + 8) + "px";
	},

	async revealCategory(category) {
		category.revealed = true;
		let y = this.getCompletedCategories() - 1;
		// moving to top
		await this.moveTermsToRow(category.terms, y);
		// displaying category
		let el = document.getElementById("grid").appendChild(document.createElement("div"));
		el.classList.add("category", category.color);
		el.textContent = category.name;
		let terms = el.appendChild(document.createElement("div"));
		terms.classList.add("category-terms");
		terms.innerHTML = category.terms.map(term => term.innerHTML).join(", ");
		this.move(el, y * 4, false);
	},

	async moveTermsToRow(terms, row) {
		for (let i = 0; i < 4; i++) {
			this.move(terms[i], i + row * 4);
			terms[i].classList.add("disabled");
		}
		await new Promise(r => setTimeout(r, 600));
	},

	getCompletedCategories() {
		return Object.values(game.categories).reduce((total, category) => total + category.revealed, 0);
	},

	// buttons

	submit() {
		if (this.guesses.some(guess => guess.every(term => this.selected.includes(term)))) {
			this.status("Already guessed!");
		}
		else {
			this.guesses.push([...this.selected]);
			let category = this.getCategory(this.selected);
			category ? this.onCorrect(category) : this.onWrong();
			this.updateButtons();
		}
	},

	deselectAll() {
		while (this.selected.length) this.selected[0].setSelected(false);
	},

	shuffle() {
		let min = this.getCompletedCategories() * 4;
		let thisi = this.terms.length, randi;
		while (thisi > min) {
			randi = Math.floor(Math.random() * (thisi - min)) + min;
			this.move(this.terms[--thisi], randi);
		}
	},

	// guesses

	getCategory(guess) {
		let id = guess[0].category;
		if (guess.every(term => term.category == id)) {
			return this.categories.find(category => category.id == id);
		}
		return null;
	},

	async onCorrect(category) {
		category.revealed = true;
		while (this.selected.length) {
			let term = this.selected.pop();
			term.classList.add("disabled");
			setTimeout(() => term.bob(), 125 * this.selected.length);
		}
		await new Promise(r => setTimeout(r, 900));
		this.revealCategory(category);
		if (this.categories.every(category => category.revealed)) this.win();
	},

	onWrong() {
		this.lives.pop().classList.add("lost");
		for (const term of this.selected) term.shake();
		for (const category of this.categories) {
			let count = category.terms.reduce((accum, term) => accum + this.selected.includes(term), 0);
			if (count == 3) {
				this.status("One away!");
				break;
			}
		}
		if (!this.lives.length) this.fail();
	},

	updateButtons() {
		document.getElementById("deselect").disabled = game.selected.length == 0;
		document.getElementById("submit").disabled = game.selected.length != 4;
	},

	// end state

	win() {
		document.getElementById("content").classList.add("disabled");
		setTimeout(() => this.showOverlay(this.guesses.length == this.categories.length ? "Perfect!" : "Well Done!"), 2000);
	},

	async fail() {
		document.getElementById("content").classList.add("disabled");
		this.deselectAll();
		this.status("Next time!");
		for (const category of this.categories) if (!category.revealed) {
			await this.revealCategory(category);
			await new Promise(r => setTimeout(r, 400));
		}
		setTimeout(() => this.showOverlay("Next Time!"), 2000);
	},

	showOverlay(text) {
		document.getElementById("overlay-title").textContent = text;
		document.getElementById("overlay-guesses").append(...this.guesses.flat().map(term => {
			let el = document.createElement("div");
			el.classList.add("overlay-term", this.categories.find(category => category.terms.includes(term)).color);
			return el;
		}));
		document.getElementById("overlay").hidden = false;
	},

	// status

	status(text) {
		let el = document.getElementById("status");
		el.textContent = text;
		el.animate({"opacity": [0, ...new Array(6).fill(1), 0]}, {duration: 1000, fill: "both"});
	},
	
};

// terms

class Term extends HTMLElement {

	category;

	constructor(text, category) {
		super();
		this.classList.add("term");
		this.innerHTML = text;
		this.category = category;
		this.addEventListener("click", this.onClick);
	}

	connectedCallback() {
		game.move(this, game.terms.indexOf(this), false);
	}

	onClick() {
		this.setSelected(!game.selected.includes(this));
	}

	setSelected(value) {
		if (value == game.selected.includes(this)) return;
		if (value) {
			if (game.selected.length < 4) {
				this.classList.add("selected");
				game.selected.push(this);
			}
		}
		else {
			this.classList.remove("selected");
			game.selected.splice(game.selected.indexOf(this), 1);
		}
		game.updateButtons();
	}

	shake() {
		this.animate({translate: ["0", "-6px", "6px", "0"]}, 250);
	}

	bob() {
		this.animate({translate: ["0 0", "0 -12px", "0 0"]}, 250);
	}

}

customElements.define("c-term", Term);

// buttons

document.getElementById("shuffle").addEventListener("click", () => game.shuffle());
document.getElementById("deselect").addEventListener("click", () => game.deselectAll());
document.getElementById("submit").addEventListener("click", () => game.submit());
document.getElementById("share").addEventListener("click", function () {
	navigator.clipboard.writeText("Junnections #" + document.getElementById("selector").value + game.guesses.reduce((accum, guess) => {
		return accum + "\n" + guess.reduce((accum, term) => {
			return accum + {yellow: "🟨", blue: "🟦", green: "🟩", purple: "🟪", red: "🟥"}[game.categories.find(category => category.terms.includes(term)).color];
		}, "");
	}, ""));
	this.textContent = "Results copied!";
});
document.getElementById("close").addEventListener("click", () => {
	document.getElementById("overlay").style.display = "none";
});

// selector

const selector = document.getElementById("selector");
selector.value = location.search ? location.search.substring(1) : selector.lastElementChild.value;
selector.title = selector.options[selector.selectedIndex].textContent;
selector.addEventListener("change", () => location.href = "?" + selector.value);

// loading

XML.fetch(`puzzles/${selector.value}.xml`).then(xml => {
	// grid
	let grid = document.getElementById("grid");
	game.terms = xml.get("terms").nodes.map(node => new Term(node.text, node.attributes.category));
	game.categories = xml.get("categories").nodes.map(node => {return {name: node.text, color: node.attributes.color, id: node.attributes.id, terms: game.terms.filter(term => term.category == node.attributes.id), revealed: false}});
	grid.style.setProperty("--rows", game.categories.length);
	grid.append(...game.terms);
	// mistakes
	for (let i = xml.attributes.mistakes ?? 4; i > 0; i--) {
		let life = document.getElementById("mistakes").appendChild(document.createElement("div"));
		life.classList.add("life");
		game.lives.push(life);
	}
	// custom behavior
	if (xml.get("style")) document.body.appendChild(document.createElement("style")).textContent = xml.get("style").text;
	if (xml.get("script")) document.body.appendChild(document.createElement("script")).textContent = xml.get("script").text;
});