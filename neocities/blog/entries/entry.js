let mood = document.getElementById("mood");
mood.innerHTML = `feeling... <span id="mood-bubble" onclick="meow()">${mood.textContent} <img src="_emotes/${mood.textContent}.png"></span>`;

function meow() {
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/meow.mp3").play();
}