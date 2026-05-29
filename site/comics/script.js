const main = document.getElementById("main");

// rotates zine subtly to angle toward cursor
main.addEventListener("mousemove", function(e) {
	let rotX = (e.y - (this.offsetTop + this.offsetHeight / 2)) * 0.01;
	let rotY = (e.x - (this.offsetLeft + this.offsetWidth / 2)) * -0.005;
	this.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
});

// resets zine rotation when cursor leaves
main.addEventListener("mouseleave", function() {
	this.style.transform = "none";
});

// navigates with keyboard
addEventListener("keydown", e => {
	if (e.key == "ArrowLeft")  { flip("left");  }
	if (e.key == "ArrowRight") { flip("right"); }
});

// navigates using the left or right page
function flip(dir) {
	let current_section = location.hash ? document.getElementById(location.hash.slice(1)) : main.firstElementChild;
	current_section.querySelector(`& > .${dir} > a`)?.click();
}