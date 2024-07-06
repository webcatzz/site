let mood = document.getElementById("mood");
if (mood) mood.innerHTML = `feeling... <span id="mood-bubble" onclick="meow()">${mood.textContent} <img src="_emotes/${mood.textContent}.png" aria-hidden="true"></span>`;

function meow() {
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/meow.mp3").play();
}


// iframe redirect
if (self === top) {
	location.replace("../?entry=" + location.pathname.slice(location.pathname.lastIndexOf("/") + 1));
}