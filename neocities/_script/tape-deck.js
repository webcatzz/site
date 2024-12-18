// webstring by june @ webcatz.neocities.org

class TapeDeck extends HTMLElement {

	path = "https://file.garden/ZdmFgugxzVCR-8Bl/";

	audio = new Audio;
	list = [];
	idx = -1;

	title;

	connectedCallback() {
		for (const string of this.getAttribute("list").split("\n")) {
			if (string.trim()) this.list.push(string.trim());
		}

		if (this.hasAttribute("shuffle")) {
			let thisi = this.list.length, randi;
			while (thisi > 0) randi = Math.floor(Math.random() * thisi--), [this.list[thisi], this.list[randi]] = [this.list[randi], this.list[thisi]];
		}

		let playButton = this.appendChild(document.createElement("button"));
		playButton.textContent = "play";
		playButton.addEventListener("click", () => this.toggle());
		this.audio.addEventListener("pause", () => playButton.textContent = "play");
		this.audio.addEventListener("play", () => playButton.textContent = "pause");

		if (this.list.length > 1) {
			let skipButton = this.appendChild(document.createElement("button"));
			skipButton.textContent = "skip";
			skipButton.addEventListener("click", () => this.playNext());
		}

		this.title = this.appendChild(document.createElement("select"));
		this.title.className = "track-title";
		for (let i = 0; i < this.list.length; i++) {
			let opt = this.title.appendChild(document.createElement("option"));
			opt.value = i;
			opt.textContent = this.list[i];
		}
		this.title.addEventListener("change", () => {
			this.set(Number(this.title.value));
			this.play();
		});

		this.audio.addEventListener("ended", () => this.playNext());
		this.next();
	}

	set(i) {
		this.idx = i;
		this.audio.src = this.path + encodeURIComponent(this.list[this.idx]) + ".mp3";
		this.title.value = this.idx;
		this.title.title = this.list[this.idx];
	}

	next() {
		this.set((this.idx + 1) % this.list.length);
	}

	play() {
		this.audio.play();
	}

	playNext() {
		this.next();
		this.play();
	}

	toggle() {
		this.audio.paused ? this.audio.play() : this.audio.pause();
	}

}


customElements.define("tape-deck", TapeDeck);