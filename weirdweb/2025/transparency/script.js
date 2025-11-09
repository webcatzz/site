const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const strokeRadius = 48;
const bayer = [[0/16, 12/16, 3/16, 15/16], [8/16, 4/16, 11/16, 7/16], [2/16, 14/16, 1/16, 13/16], [10/16, 6/16, 9/16, 5/16]];

let valueMap;
let alphaMap;
let cursorX = 0;
let cursorY = 0;

function stroke() {
	for (let i = -strokeRadius; i < strokeRadius; i++) {
		for (let j = -strokeRadius; j < strokeRadius; j++) {
			let x = Math.max(0, Math.min(valueMap.length - 1, cursorX + i));
			let y = Math.max(0, Math.min(valueMap.length - 1, cursorY + j));
			if (valueMap[x][y] && alphaMap[x][y] != 1 && Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2)) < strokeRadius) {
				alphaMap[x][y] = Math.min(1, alphaMap[x][y] + 0.1);
				if (bayer[x % 4][y % 4] + alphaMap[x][y] - 1 > 0) {
					ctx.fillStyle = "white";
					ctx.fillRect(x, y, 1, 1);
				}
			}
		}
	}
}

fetch("moon.txt").then(async res => {
	valueMap = (await res.text()).split("\n").map(line => Array.from(line).map(char => char == "1"));
	canvas.width = valueMap.length;
	canvas.height = valueMap.length;
	alphaMap = Array(valueMap.length);
	for (let i = 0; i < alphaMap.length; i++) alphaMap[i] = new Array(alphaMap.length).fill(0);
	addEventListener("mousemove", e => {cursorX = e.x - canvas.offsetLeft, cursorY = e.y - canvas.offsetTop});
	setInterval(stroke, 100);
});