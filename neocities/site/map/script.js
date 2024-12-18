const map = document.body;
const stopOffset = {x: 28, y: 10};

let style = getComputedStyle(document.body);
const colors = [
	style.getPropertyValue("--blue"),
	style.getPropertyValue("--red"),
	style.getPropertyValue("--yellow"),
];

onload = () => {
	const ctx = map.querySelector("canvas").getContext("2d");
	ctx.canvas.width = map.offsetWidth;
	ctx.canvas.height = map.offsetHeight;
	ctx.lineWidth = 40;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";

	let i = -1;
	let beforeWrap = true;

	for (const item of map.querySelectorAll("& > ul > li")) {
		ctx.strokeStyle = ++i ? colors[i % colors.length] : style.getPropertyValue("--dark-gray");
		item.style.setProperty("--color", ctx.strokeStyle);

		ctx.beginPath();
		ctx.moveTo(item.offsetLeft, item.offsetTop - 21.5);
		ctx.lineTo(item.offsetLeft + stopOffset.x, item.offsetTop + stopOffset.y);

		for (const subitem of item.getElementsByTagName("li")) {
			if (beforeWrap && subitem.offsetLeft > map.offsetWidth / 2) {
				if (subitem.previousElementSibling) {
					ctx.lineTo(subitem.previousElementSibling.offsetLeft + stopOffset.x, ctx.canvas.height);
					ctx.moveTo(subitem.offsetLeft + stopOffset.x, 0);
				}
				beforeWrap = false;
			}
			ctx.lineTo(subitem.offsetLeft + stopOffset.x, subitem.offsetTop + stopOffset.y);
		}

		ctx.stroke();
	}

}