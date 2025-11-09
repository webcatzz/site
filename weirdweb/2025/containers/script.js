const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const rainbow = ["red", "orange", "lime", "dodgerblue", "magenta"];

canvas.width = innerWidth;
canvas.height = innerHeight;

function octree(x, y, width, height, layer, px, py) {
	if (width < 16 || height < 16 || (px < x || px - x > width || py < y || py - y > height)) {
		ctx.strokeStyle = rainbow[layer % rainbow.length];
		ctx.strokeRect(x, y, width, height);
		return;
	}

	let half_width = width / 2;
	let half_height = height / 2;
	octree(x, y, half_width, half_height, layer + 1, px, py);
	octree(x + half_width, y, half_width, half_height, layer + 1, px, py);
	octree(x, y + half_height, half_width, half_height, layer + 1, px, py);
	octree(x + half_width, y + half_height, half_width, half_height, layer + 1, px, py);
}

canvas.addEventListener("mousemove", e => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	octree(0, 0, canvas.width, canvas.height, -1, e.offsetX, e.offsetY);
});

addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
})