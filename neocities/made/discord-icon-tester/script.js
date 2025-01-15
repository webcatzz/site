const workbench = document.getElementById("workbench"), cropCircle = document.getElementById("crop");
const history = {};
var data;


// setup ---

// upload buttons
document.getElementById("select").onclick = function () {this.nextElementSibling.click()}
document.getElementById("select-file").onchange = function () {upload(this.files[0])}

// disabled buttons
let disabledButtons = ["download", "apply", "zoom-in", "zoom-value", "zoom-out", "remember"];
for (const id of disabledButtons) document.getElementById(id).disabled = true;
document.getElementById("select-file").addEventListener("change", () => {
	for (const id of disabledButtons) document.getElementById(id).removeAttribute("disabled");
}, {once: true})

// drag and drop
ondragover = e => e.preventDefault(), ondrop = e => {
	e.preventDefault();
	upload(e.dataTransfer.items[0].getAsFile());
}

// swipe controls
workbench.onmousedown = e => {if (e.target == workbench) {
	workbench.style.cursor = "grabbing";
	addEventListener("mousemove", swipe);
	addEventListener("mouseup", () => {
		removeEventListener("mousemove", swipe);
		workbench.style.cursor = "grab";
	}, {once: true});
}}
function swipe(e) {moveBy(e.movementX, e.movementY)}

// zoom
document.getElementById("zoom-value").onchange = function () {zoom(Number(this.value))};
document.getElementById("zoom-in").onclick = () => addZoom(0.05);
document.getElementById("zoom-out").onclick = () => addZoom(-0.05);
function addZoom(amount) {
	zoom(data.zoom + amount);
}

// apply and download
document.getElementById("apply").onclick = () => apply();
document.getElementById("download").onclick = download;

// profile inputs
document.getElementById("profile-banner").value = "#808080", document.getElementById("profile-name").value = "";
document.getElementById("profile-banner").oninput = function () {document.body.style.setProperty("--accent", this.value)};
document.getElementById("profile-name").oninput = function () {for (const el of document.getElementsByClassName("name-replace")) el.textContent = this.value ? this.value : "Name"};
document.querySelector("#profile-icon .icon").onclick = () => document.getElementById("select-file").click();

// history
document.getElementById("remember").onclick = remember;


// use ---

// loading image
function upload(file) {
	let url = URL.createObjectURL(file);
	// loading as image
	let reader = new FileReader;
	reader.onload = () => {
		image = new Image;
		image.onload = () => {
			// setting up variables
			let minZoom = 248 / Math.min(image.width, image.height);
			data = {
				image: image,
				url: url,
				width: image.width,
				height: image.height,
				x: 0,
				y: 0,
				maxX: image.width * minZoom,
				maxY: image.height * minZoom,
				zoom: minZoom,
				minZoom: minZoom,
			};
			setUpWorkbench();
		}, image.src = url;
	}
	reader.readAsDataURL(file);
	// enabling buttons (later: fix to do this only once)
}

// setting up workbench
function setUpWorkbench() {
	cropCircle.style.backgroundImage = "url(" + data.url + ")";
	workbench.style.backgroundImage = "url(" + data.url + ")";
	zoom(data.zoom);
}

// moving image
function moveBy(x, y) {
	data.x = Math.min(Math.max(data.x + x, 248 - data.maxX), 0);
	data.y = Math.min(Math.max(data.y + y, 248 - data.maxY), 0);

	cropCircle.style.backgroundPosition = data.x + "px " + data.y + "px";
	workbench.style.backgroundPosition = data.x + cropCircle.offsetLeft + "px " + (data.y + cropCircle.offsetTop) + "px";
}

// zooming image
function zoom(value) {
	value = Math.max(value, data.minZoom);
	data.zoom = value;

	let percentX = data.x / data.maxX, percentY = data.y / data.maxY;
	data.maxX = data.width * data.zoom;
	data.maxY = data.height * data.zoom;
	data.x = percentX * data.maxX;
	data.y = percentY * data.maxY;
	moveBy(0, 0);

	cropCircle.style.backgroundSize = data.maxX + "px " + data.maxY + "px";
	workbench.style.backgroundSize = data.maxX + "px " + data.maxY + "px";

	document.getElementById("zoom-value").value = value;
}

// url of cropped image
async function crop() {
	let cropSize = 248 / data.zoom, canvas = new OffscreenCanvas(cropSize, cropSize);
	canvas.getContext("2d").drawImage(data.image, -data.x / data.zoom, -data.y / data.zoom, cropSize, cropSize, 0, 0, cropSize, cropSize);

	let url = URL.createObjectURL(await canvas.convertToBlob({type: "image/png"}));
	data.urlCropped = url;

	return url;
}

// applying
async function apply(cropURL = null) {
	let url = cropURL ?? await crop();
	for (const icon of document.getElementsByClassName("icon-replace")) icon.src = url;
}

// downloading
async function download() {
	let url = await crop();
	let a = document.createElement("a");
	a.href = url;
	a.download = "icon.png";
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		a.remove();
	}, 0);
}

// saving to history
async function remember() {
	await apply();
	let time = String(new Date().valueOf());
	history[time] = copyData(data);
	// entry element
	let el = document.createElement("div");
	el.className = "entry";
	document.getElementById("entries").prepend(el);
	// icon preview
	let img = el.appendChild(document.createElement("img"));
	img.src = history[time].urlCropped, img.className = "icon";
	img.onclick = () => {
		data = copyData(history[time]);
		setUpWorkbench();
		apply(data.urlCropped);
	}
	// delete button
	let button = el.appendChild(document.createElement("button"));
	button.appendChild(document.createElement("i")).className = "fa-solid fa-minus";
	button.onclick = function () {
		this.parentElement.remove();
		delete history[time];
	}
}

// duplicating data (prevents some strings being copied over & causing bugs)
function copyData(object) {
	return Object.assign({}, object, {urlCropped: object.urlCropped.repeat(1)});
}