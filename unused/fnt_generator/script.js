// data

const font = {
	face: "font",
	size: 16,
	lineHeight: 32,
	base: 12,
	chars: [],

	import(file) {
		let reader = new FileReader;
		reader.addEventListener("load", () => {
			let tags = reader.result.split("\n").map(line => {
				let slices = line.split(" ");
				return Object.fromEntries([["name", slices.shift()]].concat(slices.map(slice => {
					let [key, value] = slice.split("=", 2);
					if (value.startsWith("\"")) value = value.slice(1, value.length - 1);
					else if (value.includes(",")) value = value.split(",");
					else value = Number(value);
					return [key, value];
				})));
			});
			Object.assign(this, tags.find(tag => tag.name === "info"), tags.find(tag => tag.name === "common"));
			for (const charTag of tags.filter(tag => tag.name === "char")) {
				let char = canvas.char(canvas.rect(charTag));
				char.string = String.fromCharCode(char.id);
			}
		});
		reader.addEventListener("error", () => alert("something went wrong when loading your file\nerror: " + reader.error));
		reader.readAsText(file);
	},

	toString: () => `info face="${font.face}" size=${font.size} bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1 outline=0
common lineHeight=32 base=12 scaleW=${canvas.image.naturalWidth} scaleH=${canvas.image.naturalHeight} pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="${font.face}.png"
chars count=${font.chars.length}
${font.chars.sort((a, b) => a.string > b.string).reduce((str, char) => str + `char id=${char.string.charCodeAt(0)} x=${char.x} y=${char.y} width=${char.width} height=${char.height} xoffset=${char.xOffset ?? 0} yoffset=${char.yOffset ?? 0} xadvance=${char.xAdvance ?? char.width} page=0 chnl=0\n`, "")}`,
};

font.chars.remove = function (char) {
	this.splice(this.indexOf(char), 1);
	char.remove();
};

// canvas

const canvas = Object.assign(document.getElementById("canvas"), {

	image: document.getElementById("font-image"),
	scale: 1,

	fit(el, rect) {
		Object.assign(el, rect);
		el.style.left = el.x * this.scale + "px";
		el.style.top = el.y * this.scale + "px";
		el.style.width = el.width * this.scale + "px";
		el.style.height = el.height * this.scale + "px";
	},

	rect(rect) {
		let el = this.appendChild(document.createElement("div"));
		el.classList.add("rect");
		this.fit(el, rect);
		return el;
	},

	char(rect) {
		rect.classList.add("char-rect");
		rect.addEventListener("click", this.onCharRectClick);
		font.chars.push(rect);
		return rect;
	},

	loadImage(file) {
		let reader = new FileReader;
		reader.addEventListener("load", () => {
			this.image.addEventListener("load", () => {
				this.scale = Math.min((innerWidth - 64) / this.image.naturalWidth, (innerHeight - 64) / this.image.naturalHeight);
				this.image.style.width = this.image.naturalWidth * this.scale + "px";
				this.image.style.height = this.image.naturalHeight * this.scale + "px";
			});
			this.image.src = reader.result;
			document.getElementById("image-input").hidden = true;
			document.getElementById("canvas-tip").hidden = false;
		});
		reader.addEventListener("error", () => alert("something went wrong when loading your file\nerror: " + reader.error));
		reader.readAsDataURL(file);
	},

	onMouseDown(e) {
		if (this.mouseRect) this.mouseRect.remove();
		if (e.target != this) return;
		this.mouseRect = this.rect({
			x: Math.floor(e.offsetX / this.scale),
			y: Math.floor(e.offsetY / this.scale),
			width: 1,
			height: 1,
		});
		this.mouseRect.ox = this.mouseRect.x;
		this.mouseRect.oy = this.mouseRect.y;
		addEventListener("mousemove", this.onMouseMove);
		addEventListener("mouseup", this.onMouseUp, {once: true});
	},

	onMouseMove(e) {
		let x = Math.min(canvas.image.naturalWidth - 1, Math.max(0, Math.floor((e.x - canvas.offsetLeft) / canvas.scale)));
		let y = Math.min(canvas.image.naturalHeight - 1, Math.max(0, Math.floor((e.y - canvas.offsetTop) / canvas.scale)));
		canvas.fit(canvas.mouseRect, {
			x: Math.min(x + (x > canvas.mouseRect.ox ? 1 : 0), canvas.mouseRect.ox),
			y: Math.min(y + (y > canvas.mouseRect.oy ? 1 : 0), canvas.mouseRect.oy),
			width: Math.abs(x - canvas.mouseRect.ox) + 1,
			height: Math.abs(y - canvas.mouseRect.oy) + 1,
		});
	},

	onMouseUp() {
		removeEventListener("mousemove", canvas.onMouseMove);
	},

	onKeyDown(e) {
		if (this.mouseRect) {
			if (e.key == "Enter") {
				this.char(this.mouseRect);
				charConfig.open(this.mouseRect);
				this.mouseRect = null;
			}
			else if (e.key == "Backspace") {
				for (let x = this.mouseRect.x; x < this.mouseRect.x + this.mouseRect.width; x++)
					for (let y = this.mouseRect.y; y < this.mouseRect.y + this.mouseRect.height; y++)
						for (const el of document.elementsFromPoint(canvas.offsetLeft + (x + 0.5) * canvas.scale, canvas.offsetTop + (y + 0.5) * canvas.scale))
							if (el.classList.contains("char-rect")) font.chars.remove(el);
				this.mouseRect.remove();
				this.mouseRect = null;
			}
		}
	},

	onCharRectClick() {
		charConfig.open(this);
	},

});

canvas.addEventListener("mousedown", canvas.onMouseDown);
addEventListener("keydown", e => canvas.onKeyDown(e));

// char config

const charConfig = document.getElementById("char-config");
charConfig.stringInput = document.getElementById("string-input");
charConfig.xInput = document.getElementById("x-input");
charConfig.yInput = document.getElementById("y-input");
charConfig.widthInput = document.getElementById("width-input");
charConfig.heightInput = document.getElementById("height-input");
charConfig.xAdvanceInput = document.getElementById("x-advance-input");
charConfig.xOffsetInput = document.getElementById("x-offset-input");
charConfig.yOffsetInput = document.getElementById("y-offset-input");
charConfig.removeButton = document.getElementById("remove-button");
charConfig.closeButton = document.getElementById("close-button");

charConfig.open = function (char) {
	if (!this.classList.contains("hidden")) {
		this.close();
		if (!char.parentElement) return;
	}
	this.char = char;
	this.stringInput.value = char.string ?? "";
	this.xInput.valueAsNumber = char.x ?? 0;
	this.xInput.max = canvas.image.naturalWidth - char.width;
	this.yInput.valueAsNumber = char.y ?? 0;
	this.yInput.max = canvas.image.naturalHeight - char.height;
	this.widthInput.valueAsNumber = char.width ?? 0;
	this.heightInput.valueAsNumber = char.height ?? 0;
	this.xAdvanceInput.valueAsNumber = char.xAdvance;
	this.xAdvanceInput.placeholder = char.width;
	this.xOffsetInput.valueAsNumber = char.xOffset;
	this.yOffsetInput.valueAsNumber = char.yOffset;
	this.closeButton.disabled = !this.stringInput.value;
	this.classList.remove("hidden");
	this.style.left = Math.min(canvas.offsetWidth - this.offsetWidth, Math.max(0, char.offsetLeft + (char.offsetWidth - this.offsetWidth) / 2)) + "px";
	this.style.top = char.offsetTop + char.offsetHeight + "px";
	this.stringInput.focus();
};

charConfig.close = function () {
	if (this.classList.contains("hidden")) return;
	this.classList.add("hidden");
	if (!this.stringInput.value) font.chars.remove(this.char);
	else {
		this.char.string = this.stringInput.value;
		if (this.xAdvanceInput.valueAsNumber) this.char.xAdvance = this.xAdvanceInput.valueAsNumber;
		if (this.xOffsetInput.valueAsNumber) this.char.xOffset = this.xOffsetInput.valueAsNumbe;
		if (this.yOffsetInput.valueAsNumber) this.char.yOffset = this.yOffsetInput.valueAsNumbe;
	}
	this.char = null;
};

charConfig.addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		this.closeButton.click();
		e.stopPropagation();
	}
});

charConfig.stringInput.addEventListener("input", function () {
	charConfig.closeButton.disabled = this.value.length === 0;
});

charConfig.xInput.addEventListener("input", function () {
	canvas.fit(charConfig.char, {x: this.valueAsNumber});
	charConfig.widthInput.max = canvas.image.naturalWidth - charConfig.char.x;
});

charConfig.yInput.addEventListener("input", function () {
	canvas.fit(charConfig.char, {y: this.valueAsNumber});
	charConfig.heightInput.max = canvas.image.naturalHeight - charConfig.char.y;
});

charConfig.widthInput.addEventListener("input", function () {
	canvas.fit(charConfig.char, {width: this.valueAsNumber});
	charConfig.xInput.max = canvas.image.naturalWidth - charConfig.char.width;
	charConfig.xAdvanceInput.placeholder = charConfig.char.width ? charConfig.char.width : 0;
});

charConfig.heightInput.addEventListener("input", function () {
	canvas.fit(charConfig.char, {height: this.valueAsNumber});
	charConfig.yInput.max = canvas.image.naturalHeight - charConfig.char.height;
});

charConfig.removeButton.addEventListener("click", () => {
	charConfig.stringInput.value = "";
	charConfig.close();
});

charConfig.closeButton.addEventListener("click", () => {
	charConfig.close();
});

// font config

let imageInput = document.getElementById("image-input");
imageInput.addEventListener("input", () => canvas.loadImage(imageInput.files[0]));
if (imageInput.files.length) canvas.loadImage(imageInput.files[0]);

document.getElementById("name-input").addEventListener("input", function () {
	font.face = this.value ? this.value : "font";
});

document.getElementById("download-button").addEventListener("click", () => {
	let el = document.createElement("a");
	el.href = "data:text/plain;charset=utf-8," + encodeURIComponent(font.toString());
	el.download = font.name + ".fnt";
	document.body.appendChild(el);
	el.click();
	el.remove();
});

canvas.image.addEventListener("load", () => {
	let importInput = document.getElementById("import-input");
	importInput.addEventListener("input", () => font.import(importInput.files[0]));
	if (importInput.files.length) font.import(importInput.files[0]);
});