// drag.js by june @ webcatz.neocities.org

/*

how to use:

1. make a new javascript file (ending with .js) somewhere on your site

2. copy this script into it

3. include the following tag somewhere in a page's <head></head>:
<script defer src="wherever/youre/storing/drag.js" data-select=".draggable"></script>

4. set src to the path of the js file you just made

5. set data-select to select the elements that will be draggable. it works exactly like a css selector

*/

const Drag = {

	z: 0,

	add: el => {
		el.addEventListener("mousedown", Drag.start);
		if (el.tagName === "IMG" || el.tagName === "A") el.draggable = false;
		for (const child of el.querySelectorAll("img, a")) child.draggable = false;
	},

	remove: el => {
		el.removeEventListener("mousedown", Drag.start);
		if (el.tagName === "IMG" || el.tagName === "A") el.removeAttribute("draggable");
		for (const child of el.querySelectorAll("img, a")) child.removeAttribute("draggable");
	},

	start: function (e) {
		Drag.active = this;
		Drag.grabX = e.x - this.offsetLeft;
		Drag.grabY = e.y - this.offsetTop;
		this.style.zIndex = ++Drag.z;

		addEventListener("mousemove", Drag.move);
		addEventListener("mouseup", Drag.end, {once: true});
		this.dispatchEvent(new MouseEvent("dragstart", e));
	},

	move: e => {
		Drag.active.style.left = e.x - Drag.grabX + "px";
		Drag.active.style.top = e.y - Drag.grabY + "px";

		Drag.active.dispatchEvent(new MouseEvent("drag", e));
	},

	end: e => {
		removeEventListener("mousemove", Drag.move);

		let active = Drag.active;
		delete Drag.active;
		active.dispatchEvent(new MouseEvent("dragend", e));
	}

};

for (const el of document.querySelectorAll(document.currentScript.dataset.select)) Drag.add(el);