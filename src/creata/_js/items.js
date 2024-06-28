class MacWindow extends HTMLElement {

	static windows = {};

	connectedCallback() {
		this.classList.add("window");
		MacWindow.windows[this.getAttribute("name")] = this;

		// contents
		let content = document.createElement("div");
		content.className = "content";
		content.append(...this.childNodes);
		this.appendChild(content);
		
		// header
		let header = document.createElement("header");
		header.className = "window-title";
		header.appendChild(document.createElement("span")).textContent = this.getAttribute("name");
		header.appendChild(document.createElement("button")).onclick = () => this.close();
		this.prepend(header);
		
		// event listeners
		Drag.add(this, header);
		this.addEventListener("mousedown", this.focus);

		// position
		let hidden = this.classList.contains("hidden");
		if (hidden) this.classList.remove("hidden");

		let rect = this.getAttribute("rect").split(" ");
		this.style.left = (rect[0] < 0 ? innerWidth - this.offsetWidth + Number(rect[0]) : rect[0]) + "px";
		this.style.top = (rect[1] < 0 ? innerHeight - this.offsetHeight + Number(rect[1]) : rect[1]) + "px";
		this.style.width = rect[2] + "px";
		this.style.height = rect[3] + "px";

		if (hidden) this.classList.add("hidden");
	}


	async open() {
		this.classList.remove("hidden");
		this.focus();
	}

	close() {
		this.classList.add("hidden");
		this.dispatchEvent(new Event("closed"));
	}

	focus() {
		document.getElementsByClassName("active")[0]?.classList.remove("active")
		this.classList.add("active");
		this.style.zIndex = ++Drag.z;
	}

	static openNamed(name) {
		MacWindow.windows[name]?.open();
	}

}



class MacFolder extends MacWindow {

	header;
	content;

	connectedCallback() {
		super.connectedCallback();

		this.header = document.createElement("header");
		this.header.className = "folder-header";
		this.updateItemCount();
		this.firstChild.after(this.header);

		this.content = this.querySelector(".content");

		this.addEventListener("mouseup", this.onmouseup);
		for (const file of this.content.getElementsByTagName("mac-file")) {
			file.addEventListener("dragend", e => this.onfiledragend(e), {once: true});
		}
	}

	onmouseup() {
		if (
			Drag.active instanceof MacFile &&
			Drag.active.parentElement !== this.content &&
			Drag.active.getAttribute("name") !== this.getAttribute("name")
		) {
			Drag.active.addEventListener("dragend", e => this.onfiledragend(e), {once: true});
		}
	}

	onfiledragend(e) {
		let contentRect = this.content.getBoundingClientRect();

		if (this.inRect(e, contentRect)) {
			Drag.active.style.left = e.x - Drag.grabX - contentRect.left + "px";
			Drag.active.style.top = e.y - Drag.grabY - contentRect.top + "px";
			this.content.appendChild(Drag.active);
			Drag.active.addEventListener("dragend", e => this.onfiledragend(e), {once: true});
		}
		else document.body.appendChild(Drag.active);

		this.updateItemCount();
	}

	updateItemCount() {
		let itemNum = this.querySelectorAll("mac-file").length;
		this.header.textContent = itemNum + (itemNum === 1 ? " item" : " items");
	}

	inRect(pos, rect) {
		return pos.x > rect.left &&
			pos.x < rect.left + rect.width &&
			pos.y > rect.top &&
			pos.y < rect.top + rect.height
	}

}




class MacFile extends HTMLElement {

	constructor() {
		super();
		this.appendChild(document.createElement("img")).src = "_assets/" + this.getAttribute("type") + ".png";
		this.appendChild(document.createElement("div")).textContent = this.getAttribute("name");

		// position
		let pos = this.getAttribute("position").split(" ");
		this.style.left = (pos[0] < 0 ? innerWidth - this.offsetWidth + Number(pos[0]) : pos[0]) + "px";
		this.style.top = (pos[1] < 0 ? innerHeight - this.offsetHeight + Number(pos[1]) : pos[1]) + "px";

		// event listeners
		Drag.add(this);
		this.addEventListener("dblclick", this.open);
	}

	open() {
		MacWindow.openNamed(this.getAttribute("name"));
	}

}




class AudioPlayer extends HTMLElement {

	audio;

	constructor() {
		super();
		this.audio = new Audio(this.getAttribute("src"));

		let toggle = this.appendChild(document.createElement("button"));
		toggle.textContent = "play";
		toggle.onclick = () => this.toggle();

		let stop = this.appendChild(document.createElement("button"));
		stop.textContent = "stop";
		stop.onclick = () => this.stop();

		this.audio.ontimeupdate = () => {
			this.style.setProperty("--time", this.offsetWidth - this.offsetWidth * this.audio.currentTime / this.audio.duration + "px");
		}

		this.parentElement.parentElement.addEventListener("closed", () => this.stop());
	}

	toggle() {
		this.audio.paused ? this.audio.play() : this.audio.pause();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}

}




customElements.define("mac-window", MacWindow);
customElements.define("mac-folder", MacFolder);
customElements.define("mac-file", MacFile);
customElements.define("audio-player", AudioPlayer);

// draggables
for (const el of document.querySelectorAll("img, a")) el.draggable = false;