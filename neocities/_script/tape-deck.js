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

		if (!this.hasAttribute("single")) {
			let skipButton = this.appendChild(document.createElement("button"));
			skipButton.textContent = "skip";
			skipButton.addEventListener("click", () => this.playNext());
		}

		this.title = this.appendChild(document.createElement("div"));
		this.title.className = "track-title";

		this.audio.addEventListener("ended", () => this.playNext());
		this.next();
	}

	next() {
		this.idx = (this.idx + 1) % this.list.length;
		this.audio.src = this.path + encodeURIComponent(this.list[this.idx]) + ".mp3";
		this.title.textContent = this.list[this.idx];
		this.title.title = this.list[this.idx];
	}

	playNext() {
		this.next();
		this.audio.play();
	}

	toggle() {
		this.audio.paused ? this.audio.play() : this.audio.pause();
	}

}


customElements.define("tape-deck", TapeDeck);