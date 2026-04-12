// moon phase

// returns the current phase of the moon as a number 0-1
function phase_progress(date = new Date) {
	let julian_date = date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
	let percent = (julian_date - 2451550.1) / 29.53058770576;
	percent -= Math.floor(percent);
	return percent < 0 ? percent + 1 : percent;
}

let className = [
	"new moon",
	"waxing crescent moon",
	"waxing half moon",
	"waxing gibbous moon",
	"full moon",
	"waning gibbous moon",
	"waning half moon",
	"waning crescent moon",
][Math.floor(phase_progress() * 8)];

for (const moon of document.getElementsByClassName("moon")) moon.className = className;

// stars

const STARS = document.getElementById("stars");

STARS.ctx = STARS.getContext("2d");

STARS.setup = function() {
	this.width = this.offsetWidth;
	this.height = this.offsetHeight;
	this.surfaceY = this.offsetHeight * 0.6;
	// stars
	this.starLen = 4;
	this.stars = new Array(160 * this.starLen);
	for (let i = 0; i < this.stars.length; i += this.starLen)
		this.stars.splice(i, this.starLen,
			Math.random() * this.offsetWidth, // x
			Math.random() * this.surfaceY, // y
			Math.min(Math.random() * 0.5, 1), // brightness
			Math.random() * 1000, // time origin (msec)
		);
};

STARS.animate = function(time) {
	this.ctx.clearRect(0, 0, this.width, this.height);
	// draws stars
	for (let i = 0; i < this.stars.length; i += this.starLen) {
		let [x, y, value, time_origin] = this.stars.slice(i, i + this.starLen);
		let a = Math.max(0, Math.min(1, value + Math.abs(Math.sin(time * 0.001 - time_origin) * 0.5)));
		this.ctx.fillStyle = `rgb(255, 255, 255, ${a})`;
		this.ctx.fillRect(x, y, 2, 2);
		this.ctx.fillStyle = `rgb(255, 255, 255, ${a * 0.67})`;
		this.ctx.fillRect(x, (this.surfaceY - y) + this.surfaceY, 2, 2);
	}
	// requests next frame
	requestAnimationFrame(time => STARS.animate(time));
};

STARS.setup();
STARS.animate();

// music

const musicBtn = document.getElementById("music-btn");
const music = new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/moon_grotto.mp3");
const content = document.getElementById("content");

music.loop = true;
musicBtn.addEventListener("click", () => music.paused ? music.play() : music.pause());
music.addEventListener("play", () => musicBtn.textContent = "♪ ⏸️");
music.addEventListener("pause", () => musicBtn.textContent = "♪ ▶");
content.addEventListener("mouseleave", () => music.volume = 0.5);
content.addEventListener("mouseenter", () => music.volume = 1);