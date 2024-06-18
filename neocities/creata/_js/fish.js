const fish = Object.assign(document.getElementById("fish"), {

	xMotion: 1,

	swim: () => {
		fish.style.left = fish.xMotion + fish.offsetLeft + "px";
		fish.style.marginTop = 2 * Math.sin(fish.offsetLeft / 12) + "px";

		// x-bounds
		if (fish.offsetLeft < 0) {
			fish.xMotion = 1;
			fish.style.transform = "";
		}
		else if (fish.offsetLeft > innerWidth - fish.offsetWidth) {
			fish.xMotion = -1;
			fish.style.transform = "scaleX(-1)";
		}
	},

});

setInterval(fish.swim, 200);
Drag.add(fish);