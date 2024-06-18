const Drag = {

	z: 0,

	add: (el, handle = el) => {
		handle.handleOwner = el;
		handle.addEventListener("mousedown", Drag.start);
	},

	start: function (e) {
		Drag.active = this.handleOwner;
		let rect = Drag.active.getBoundingClientRect();

		Drag.grabX = e.x - rect.left;
		Drag.grabY = e.y - rect.top;

		Drag.preview = document.body.appendChild(document.createElement("div"));
		Drag.preview.className = "drag-preview";
		Drag.preview.style = `
			left: ${rect.left}px;
			top: ${rect.top}px;
			width: ${rect.width}px;
			height: ${rect.height}px;
			z-index: ${Drag.z + 1};
		`;

		addEventListener("mousemove", Drag.move);
		addEventListener("mouseup", Drag.end, {once: true});
		Drag.active.dispatchEvent(new MouseEvent("dragstart", e));
	},

	move: e => {
		Drag.preview.style.left = e.x - Drag.grabX + "px";
		Drag.preview.style.top = Math.max(20, e.y - Drag.grabY) + "px";
		Drag.active.dispatchEvent(new MouseEvent("drag", e));
	},

	end: e => {
		removeEventListener("mousemove", Drag.move);
		Drag.active.style.left = Drag.preview.offsetLeft + "px";
		Drag.active.style.top = Drag.preview.offsetTop + "px";
		Drag.active.style.zIndex = ++Drag.z;
		Drag.active.dispatchEvent(new MouseEvent("dragend", e));

		Drag.preview.remove();
		delete Drag.preview;
		delete Drag.active;
	}

};

for (const el of document.querySelectorAll(document.currentScript.dataset.select)) Drag.add(el);