let held, heldX, heldY, heldZ = 0;

function grab(e) {
	held = e.target;
	heldX = e.offsetX + 64;
	heldY = e.offsetY + 64;
	held.style.zIndex = ++heldZ;
	addEventListener("mousemove", drag);
	addEventListener("mouseup", drop, {once: true});
}

function drag(e) {
	held.style.left = e.pageX - heldX + "px";
	held.style.top = e.pageY - heldY + "px";
}

function drop() {
	removeEventListener("mousemove", drag);
}

for (const el of document.getElementById("arena").children)
	el.addEventListener("mousedown", grab);