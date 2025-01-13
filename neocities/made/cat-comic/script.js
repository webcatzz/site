// phase

let date = new Date;
let year = date.getFullYear();
let month = date.getMonth();

if (month < 3) year--, month += 12;
month++;

let percent = (year * 365.25 + month * 30.6 + date.getDate() - 694039.09) / 29.5305882;
percent -= Math.floor(percent);

document.getElementById("phase-icon").style.objectPosition = percent * 100 + "%";
document.getElementById("phase-text").textContent = `The moon is ${[
	"new",
	"waxing crescent",
	"at its first quarter",
	"waxing gibbous",
	"full",
	"waning gibbous",
	"at its third quarter",
	"waning crescent"
][Math.round(percent * 8) % 8]}.`;



// animation

let i = 3;
for (const child of document.querySelector("main").children) {
	child.style.animationDelay = i + "s";
	i += 0.1;
}



// cloud scroll

let cloudScroll = 0;
setInterval(() => {
	cloudScroll -= 0.25;
	document.documentElement.style.setProperty("--cloud-scroll", cloudScroll + "px");
}, 100);