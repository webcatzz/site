// tapedeck by june @ juneish.neocities.org

class TapeDeck extends HTMLElement {

	dir = "https://file.garden/ZdmFgugxzVCR-8Bl/";

	audio = new Audio;
	list = [];
	idx = -1;

	connectedCallback() {
		// list
		this.list = this.getAttribute("list").split("\n").map(x => x.trim()).filter(x => x);
		if (this.hasAttribute("shuffle")) {
			let thisi = this.list.length, randi;
			while (thisi > 0) randi = Math.floor(Math.random() * thisi--), [this.list[thisi], this.list[randi]] = [this.list[randi], this.list[thisi]];
		}
		// play button
		let playBtn = this.appendChild(document.createElement("button"));
		playBtn.textContent = "play";
		playBtn.addEventListener("click", () => this.toggle());
		this.audio.addEventListener("pause", () => playBtn.textContent = "play");
		this.audio.addEventListener("play", () => playBtn.textContent = "pause");
		// skip button
		if (this.list.length > 1) {
			let skipBtn = this.appendChild(document.createElement("button"));
			skipBtn.textContent = "skip";
			skipBtn.addEventListener("click", () => this.skip());
		}
		// selector
		this.select = this.appendChild(document.createElement("select"));
		this.select.append(...this.list.map((x, i) => Object.assign(document.createElement("option"), {
			textContent: x,
			value: i,
		})))
		this.select.addEventListener("change", () => {
			this.set(Number(this.select.value));
			this.play();
		});
		// audio
		this.audio.addEventListener("ended", () => this.skip());
		this.next();
	}

	set(i) {
		this.idx = i;
		this.audio.src = this.dir + encodeURIComponent(this.list[this.idx]) + ".mp3";
		this.select.value = this.idx;
		this.select.title = this.list[this.idx];
	}

	next() {
		this.set((this.idx + 1) % this.list.length);
	}

	play() {
		this.audio.play();
	}

	skip() {
		this.next();
		this.play();
	}

	toggle() {
		this.audio.paused ? this.audio.play() : this.audio.pause();
	}

}

customElements.define("tape-deck", TapeDeck);