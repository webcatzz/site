function makeAudioPlayer(audio) {
	audio.controls = false;
	let btn = document.createElement("button");
	btn.textContent = "(play excerpt)";
	btn.addEventListener("click", () => audio.paused ? audio.play() : audio.pause());
	audio.addEventListener("play", () => btn.textContent = "(pause)");
	audio.addEventListener("pause", () => btn.textContent = "(play)");
	audio.after(btn);
}

makeAudioPlayer(document.querySelector("#earworm audio"));