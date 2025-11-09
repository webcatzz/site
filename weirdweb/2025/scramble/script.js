const staff = document.getElementById("staff");
const notes = Array(16);
const noteAnimations = Array(notes.length);
const volumeInput = document.getElementById("volume");

async function noteMove(i) {
	await (noteAnimations[i] = notes[i].animate({
		left: Math.floor(Math.random() * notes.length) * staff.offsetWidth / notes.length + staff.offsetWidth / notes.length / 2 + "px",
		top: Math.floor(Math.random() * 5) * staff.offsetHeight / 4 + "px",
	}, {
		duration: 250 + Math.random() * 1750,
		easing: "ease-in-out",
		fill: "forwards",
	})).finished;
	await (noteAnimations[i] = notes[i].animate({}, Math.random() * 1000)).finished;
	noteMove(i);
}

function notePlay(note, context, delay, duration) {
	let oscillator = context.createOscillator();
	oscillator.type = "triangle";
	oscillator.frequency.setValueAtTime(493.88 - note.offsetTop / staff.offsetHeight * 232.25, context.currentTime);
	oscillator.start(context.currentTime + delay);
	oscillator.stop(context.currentTime + delay + duration);
	setTimeout(() => note.classList.add("playing"), delay * 1000);
	setTimeout(() => note.classList.remove("playing"), (delay + duration) * 1000);
	return oscillator;
}

for (let i = 0; i < notes.length; i++) {
	let note = staff.appendChild(document.createElement("img"));
	note.classList.add("note");
	note.dataset.duration = ["half", "quarter", "eighth"][Math.floor(Math.random() * 3)];
	note.dataset.direction = Math.random() > 0.5 ? "up" : "down";
	note.src = `note_${note.dataset.duration}_${note.dataset.direction}.svg`;
	note.style.left = i * staff.offsetWidth / notes.length + staff.offsetWidth / notes.length / 2 + "px";
	notes[i] = note;
	noteMove(i);
}

document.getElementById("play").addEventListener("click", async function () {
	this.disabled = true;
	volumeInput.disabled = true;
	for (const animation of noteAnimations) animation.pause();
	notes.sort((a, b) => a.offsetLeft - b.offsetLeft);

	let context = new AudioContext;
	let gain = context.createGain();
	gain.gain.setValueAtTime(volumeInput.valueAsNumber, context.currentTime);
	gain.connect(context.destination);

	let delay = 0;
	for (let i = 0; i < notes.length; i++) {
		let duration = {half: 0.5, quarter: 0.25, eighth: 0.125}[notes[i].dataset.duration];
		notePlay(notes[i], context, delay, duration).connect(gain);
		if (i < notes.length - 1 && notes[i + 1].offsetLeft - notes[i].offsetLeft < 10) continue;
		delay += duration;
	}
	await new Promise(r => setTimeout(r, delay * 1000));

	for (const animation of noteAnimations) animation.play();
	volumeInput.disabled = false;
	this.disabled = false;
});