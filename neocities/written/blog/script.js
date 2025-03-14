XML.template = page => `
	<header>
		<h2 id="name">${page.name}</h2>
		<time id="date" datetime="${page.date}">${page.date.split("-").toReversed().join(".")}</time>
	</header>
	<main>${page.content}</main>
	<footer>
		${page.mood ? `<p>feeling... <span id="mood" onclick="meow()">${page.mood} <img src="_emote/${page.mood}.png" aria-hidden="true"></span></p>` : ""}
	</footer>
`;
XML.nav(document.getElementById("entry"), document.querySelectorAll("nav button"));



// buttons

for (const button of document.querySelectorAll("nav button")) {
	button.title = button.textContent.trim().slice(5).trimStart();
}



// background

let background = [
	{path: "bed.png", artist: "peevishpants", link: "theweiweixu.carrd.co"},
	{path: "bridge.jpg", artist: "mochipanko", link: "mochipanko.tumblr.com"},
][Math.floor(Math.random() * 2)];

document.body.style.setProperty("--background", `url(_asset/background/${background.path})`);
document.getElementById("background-credit").textContent = "background by " + background.artist;
document.getElementById("background-credit").href = "https://" + background.link;



// meow

function meow() {
	new Audio("https://file.garden/ZdmFgugxzVCR-8Bl/meow.mp3").play();
}