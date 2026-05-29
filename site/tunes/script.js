const scrollBox = document.getElementById("current-disc");
const scrollItems = document.getElementsByClassName("scroll-item");

/// radial scroll manager
/// optimized for the case where children are not mutated
const rscroll = {
	/// the current scroll value
	_scroll: 0,
	/// the maximum scroll value
	max: 0,

	/// returns the current scroll value
	get scroll() {
		return this._scroll;
	},

	/// sets the current scroll value and updates styling
	/// clamps the scroll value between `0` and `this.max`
	set scroll(v) {
		this._scroll = Math.max(0, Math.min(this.max, v));
		this.update();
	},

	/// initializes
	init() {
		this.cache();
		// adds event listeners
		scrollBox.addEventListener("wheel", e => {
			rscroll.scroll += e.deltaY;
			e.preventDefault();
		});
		scrollBox.addEventListener("touchstart", e => {
			this.touchY = e.touches[0].pageY;
			this.touchInitialScroll = rscroll.scroll;
		});
		scrollBox.addEventListener("touchmove", e => {
			rscroll.scroll = this.touchInitialScroll + (this.touchY - e.touches[0].pageY);
			e.preventDefault();
		});
		scrollBox.addEventListener("focusin", e => {
			if (e.target.matches(":focus-visible"))
				rscroll.scroll = e.target.storedOffset;
		});
	},

	/// recaches position, size information of scroll items and updates
	cache() {
		let y = 0;
		for (const item of scrollItems) {
			item.storedOffset = y + item.offsetHeight / 2 - 16;
			y += item.offsetHeight;
		}
		this.max = y;
		this.update();
	},

	/// updates styling for the current scroll value
	update() {
		let rotation;
		for (const item of scrollItems) {
			rotation = (item.storedOffset - this.scroll) / 2;
			if (!item.classList.toggle("scroll-hidden", Math.abs(rotation) > 135)) {
				item.style.rotate = rotation + "deg";
				item.style.opacity = 1.0 - (Math.abs(rotation) - 90) / 45;
			}
		}
	},

};

rscroll.init();
setTimeout(() => rscroll.cache(), 0); // recaches after assets load

// sets the center of the background gradient to be the center of the disc
{
	let rect = scrollBox.getBoundingClientRect();
	document.documentElement.style.setProperty("--disc-center", `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`);
}