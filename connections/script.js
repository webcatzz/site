const content = document.getElementById("content");

// grid

const grid = Object.assign(document.getElementById("grid"), {

	rows: 4,
	columns: 4,
	gap: 6,
	items: [],

	coordsToIndex(x, y) {
		return x + y * this.columns;
	},

	indexToCoords(idx) {
		return [idx % this.columns, Math.floor(idx / this.columns)];
	},

	fit(item, x, y, width = 1, height = 1) {
		let columnWidth = (this.offsetWidth + this.gap) / this.columns;
		let rowHeight = (this.offsetHeight + this.gap) / this.rows;
		item.style.left = x * columnWidth + "px";
		item.style.top = y * rowHeight + "px";
		item.style.width = width * columnWidth - this.gap + "px";
		item.style.height = height * rowHeight - this.gap + "px";
	},
	
	place(item, x, y) {
		this.items[this.coordsToIndex(x, y)] = item;
		this.fit(item, x, y);
		item.x = x;
		item.y = y;
	},
	
	swap(item, x, y) {
		let swappedItem = this.items[this.coordsToIndex(x, y)];
		this.place(swappedItem, item.x, item.y);
		this.place(item, x, y);
	},

	shuffle() {
		let min = game.categoriesGuessed * this.columns;
		let thisi = this.items.length, randi;
		while (thisi > min) {
			randi = Math.floor(Math.random() * (thisi - min)) + min;
			this.swap(this.items[--thisi], ...this.indexToCoords(randi));
		}
	},

});

// selection

const selection = {

	items: [],

	add(item) {
		this.items.push(item);
		item.classList.add("selected");
		updateButtons();
	},

	remove(item) {
		this.items.splice(this.items.indexOf(item), 1);
		item.classList.remove("selected");
		updateButtons();
	},

	toggle(item) {
		if (this.items.includes(item))
			this.remove(item);
		else if (this.items.length < grid.columns)
			this.add(item);
	},

	clear() {
		while (this.items.length) this.remove(this.items[this.items.length - 1]);
	},

	reset() {
		this.items = [];
		updateButtons();
	}

}

// mistakes

const mistakes = Object.assign(document.getElementById("mistakes"), {

	num: 0,
	
	gain() {
		this.num++;
		let el = this.appendChild(document.createElement("div"));
		el.classList.add("mistake");
	},

	lose() {
		this.children[--this.num].classList.add("lost");
	},
	
});

// status

const status = Object.assign(document.getElementById("status"), {

	async display(text, time = 800) {
		this.textContent = text;
		await this.animate({opacity: [0, 1]}, {duration: 100, fill: "forwards"}).finished;
		await new Promise(r => setTimeout(r, time));
		await this.animate({opacity: [1, 0]}, {duration: 100, fill: "forwards"}).finished;
	},

});

// summary

const summary = Object.assign(document.getElementById("summary"), {

	comments: {},

	display(text) {
		document.getElementById("summary-title").textContent = text;
		document.getElementById("summary-guesses").append(...game.guesses.map(guess => {
			let el = document.createElement("div");
			el.classList.add("summary-guess");
			el.append(...guess.map(item => {
				let el = document.createElement("div");
				el.classList.add("summary-term", game.categories[item.category - 1].color);
				return el;
			}));
			return el;
		}));
		if (mistakes.num) document.getElementById("retry").remove();

		if (Object.keys(this.comments).length) {
			let list = document.getElementById("summary-commentary").appendChild(document.createElement("dl"));
			list.id = "summary-commentary-list";
			for (const [author, comment] of Object.entries(this.comments)) {
				let authorEl = document.createElement("dt");
				authorEl.textContent = author;
				let commentEl = document.createElement("dd");
				commentEl.textContent = comment;
				list.append(authorEl, commentEl);
			}
		}
		else document.getElementById("summary-commentary-title").textContent = "no author commentary";

		this.hidden = false;
	},

	getResultsText() {
		return "Junnections #" + selector.value + game.guesses.reduce((str, guess) => str + "\n" + guess.reduce((str, item) =>
			str + {yellow: "🟨", green: "🟩", blue: "🟦", purple: "🟪", red: "🟥"}[game.categories[item.category - 1].color]
		, ""), "");
	},
	
});

document.getElementById("retry").addEventListener("click", () => location.reload());
document.getElementById("share").addEventListener("click", function () {
	navigator.clipboard.writeText(summary.getResultsText());
	this.textContent = "Results Copied!";
});
document.getElementById("close").addEventListener("click", () => {
	summary.hidden = true;
	game.revealPuzzle();
});

// game

const game = {

	categories: [],
	guesses: [],
	categoriesGuessed: 0,

	async submit() {
		if (this.guesses.some(guess => guess.length == selection.items.length && guess.every(item => selection.items.includes(item)))) {
			status.display("Already guessed!");
			return;
		}
		content.classList.add("disabled");
		submitBtn.disabled = true;

		let items = [...selection.items];
		this.guesses.push(items);
		await this.bob(...items);
		// result
		let numIncorrect = this.countIncorrect(items);
		if (numIncorrect) {
			if (numIncorrect === 1) status.display("One away!");
			this.shake(...items);
			mistakes.lose();
			if (mistakes.num == 0)
				await this.end("Next Time!");
		}
		else {
			selection.reset();
			await this.revealCategory(items[0].category, items);
			if (this.categoriesGuessed === this.categories.length)
				await this.end(this.guesses.length === this.categoriesGuessed ? "Perfect!" : "Well Done!");
		}

		content.classList.remove("disabled");
	},

	matches(item1, item2) {
		return item1.category === item2.category;
	},

	countIncorrect(items) {
		return items.reduce((num, item) => num + Number(!this.matches(item, items[0])), 0);
	},

	async revealCategory(id, items = grid.items.filter(item => item.category == id)) {
		// moving items into place
		for (let i = 0; i < items.length; i++) {
			items[i].classList.add("disabled");
			grid.swap(items[i], i, this.categoriesGuessed);
		}
		await new Promise(r => setTimeout(r, 600));
		// displaying category
		let category = this.categories[id - 1];
		let el = grid.appendChild(document.createElement("div"));
		el.classList.add("grid-item", "category", category.color);
		el.textContent = category.text;
		let terms = el.appendChild(document.createElement("div"));
		terms.classList.add("category-terms");
		terms.innerHTML = items.map(item => item.innerHTML).join(", ");
		grid.fit(el, 0, this.categoriesGuessed, grid.columns, 1);
		category.revealed = true;
		this.categoriesGuessed++;
	},
	
	async revealPuzzle() {
		content.classList.add("disabled");
		for (let i = 0; i < this.categories.length; i++) if (!this.categories[i].revealed) {
			await new Promise(r => setTimeout(r, 250));
			await game.revealCategory(i + 1);
		}
	},

	// results

	async end(message) {
		await new Promise(r => setTimeout(r, 1000));
		summary.display(message);
	},

	// animations

	bob(...items) {
		for (let i = 0; i < items.length; i++)
			items[i].animate({translate: ["0 0", "0 -12px", "0 0"]}, {duration: 250, delay: i * 125});
		return new Promise(r => setTimeout(r, 750 + items.length * 125));
	},

	shake(...items) {
		for (const item of items)
			item.animate({translate: [0, "-6px", "6px", 0]}, 250);
		return new Promise(r => setTimeout(r, 500));
	},

};

// buttons

document.getElementById("shuffle").addEventListener("click", () => grid.shuffle());
const deselectBtn = document.getElementById("deselect");
deselectBtn.addEventListener("click", () => selection.clear());
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => game.submit());

function updateButtons() {
	deselectBtn.disabled = selection.items.length === 0;
	submitBtn.disabled = selection.items.length !== grid.columns;
}

updateButtons();

// selector

const selector = document.getElementById("selector");
selector.value = location.search ? location.search.substring(1) : selector.lastElementChild.value;
selector.title = selector.options[selector.selectedIndex]?.textContent;
selector.addEventListener("change", () => location.href = "?" + selector.value);

// loading

XML.fetch(`puzzles/${selector.value}.xml`).then(xml => {
	// dimensions
	let categories = xml.get("categories").nodes;
	let terms = xml.get("terms").nodes;
	grid.rows = categories.length;
	grid.columns = Math.floor(terms.length / grid.rows);
	// categories
	game.categories = new Array(categories.length);
	for (const category of categories) {
		game.categories[category.attributes.id - 1] = {
			color: category.attributes.color,
			text: category.text,
		};
	}
	// terms
	for (let i = 0; i < terms.length; i++) {
		let term = grid.appendChild(document.createElement("div"));
		term.classList.add("grid-item", "term");
		term.innerHTML = terms[i].text;
		term.category = terms[i].attributes.category;
		term.addEventListener("click", () => selection.toggle(term));
		grid.place(term, ...grid.indexToCoords(i));
	}
	// mistakes
	for (let i = xml.attributes.mistakes ?? 4; i > 0; i--) mistakes.gain();
	// commentary
	if (xml.get("commentary"))
		for (const comment of xml.get("commentary").nodes)
			summary.comments[comment.attributes.from] = comment.text;
	// custom behavior
	if (xml.get("style")) document.body.appendChild(document.createElement("style")).textContent = xml.get("style").text;
	if (xml.get("script")) document.body.appendChild(document.createElement("script")).textContent = xml.get("script").text;
});

// test

const debug = {

	reveal() {
		for (const item of grid.items) {
			item.classList.add("category", game.categories[item.category - 1].color);
		}
	}

};