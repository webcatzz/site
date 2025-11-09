let image = document.createElement("img");
image.src = "bliss.png";
image.addEventListener("load", () => {
	let canvas = new OffscreenCanvas(image.width, image.height);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);

	let data = ctx.getImageData(0, 0, image.width, image.height).data;
	let string = "";
	for (let i = 0; i < data.length / 4; i++) {
		string += `(${data[i]}, ${data[i + 1]}, ${data[i + 2]}) `;
	}
	document.body.textContent = string;

	let neuron = document.body.appendChild(document.createElement("a"));
	neuron.id = "neuron";
	neuron.href = "bliss.png";
	let neuronImage = neuron.appendChild(document.createElement("img"));
	neuronImage.src = "neuron.png";
	neuronImage.alt = "a diagram of a neuron";
});