const formats = [
	"The $THING",
	"The $ADJECTIVE $THING",
	"$CONCEPT",
	"$ADJECTIVE $CONCEPT",
	"$THING of $CONCEPT",
	"The $THING's $CONCEPT",
],
things=["Abyss","Angel","Anvil","Ashes","Beast","Beggar","Blade","Bridge","Chains","Chariot","Clock","Cloud","Compass","Corpse","Corridor","Crown","Crypt","Dancer","Depths","Desert","Devil","Dice","Dog","Door","Dove","Dusk","Earth","Emperor","Empress","End","Engine","Eye","Fires","Flame","Flute","Fluter","Fool","Fruit","Gambler","Gate","God","Grip","Hand","Hearth","Heir","Hermit","Hierophant","House","Husk","Jailer","Knife","Knight","Lamb","Lantern","Light","Lighthouse","Loom","Lovers","Lute","Machine","Magician","Magus","Man","Master","Maw","Maze","Meat","Moon","Mountain","Muse","Ocean","Poison","Popess","Puppet","Priestess","Prison","Prisoner","Road","Ruins","Sage","Sailor","Sand","Scholar","Scribe","Sea","Seal","Sheep","Shepherd","Ship","Shipwreck","Sky","Song","Soul","Spark","Sphinx","Star","Storm","String","Snow","Sovereign","Sun","Tear","Temple","Theft","Thief","Thread","Throne","Tide","Tightrope","Tomb","Tower","Traitor","Tree","Trick","Trickster","Voyage","Waves","Web","Whale","Wheel","Witch","Wolf","Wound"],
concepts=["Ache","Ash","Beholding","Breath","Chaos","Creation","Day","Death","Decay","Delirium","Desire","Despair","Discord","Disgust","Dust","Endurance","Envy","Escape","Fate","Fear","Filth","Flight","Folly","Fortune","Genius","God","Greed","Havoc","Heaven","Hell","Humility","Illness","Intellect","Joy","Judgement","Justice","Lust","Madness","Night","Origin","Pain","Patience","Pride","Rest","Sacrifice","Secrets","Silence","Sloth","Strange","Strength","Temperance","Union","Weakness","Will","Wisdom","Wrath"],
adjectives=["Absent","Aching","Acrid","Ancient","Black","Bloody","Brass","Broken","Burning","Burnt","Careless","Chained","Clouded","Cold","Cracked","Crying","Cryptic","Dancing","Dead","Divine","Doomed","Drowned","Feathered","Frail","Gleaming","Gold","Hanged","High","Icy","Iron","Last","Locked","Lone","Lost","Low","Mighty","Mortal","Odd","Old","Onyx","Red","Rotted","Sacred","Screaming","Shattered","Sheer","Shining","Spent","Still","Stone","Strange","Subtle","Torn","True","Unholy","Veiled","Watchful","White","Winged","Wounded"];


for (const card of document.getElementsByClassName("card-wrapper")) card.onclick = () => flipCard(card), card.querySelector(".card-image").style.transform = "scaleX(" + [1, -1][Math.floor(Math.random() * 2)] + ") scaleY(" + [1, -1][Math.floor(Math.random() * 2)] + ")", card.querySelector(".card-back").style.transform = "scaleX(" + [1, -1][Math.floor(Math.random() * 2)] + ") scaleY(" + [1, -1][Math.floor(Math.random() * 2)] + ")";

function flipCard(card) {
	card.classList.add("untouchable");
	card.animate({transform: ["scaleX(1)", "scaleX(0)"]}, {duration: 1000, easing: "ease-in"}).finished.then(() => {
		let nameNodes = []; // printing card name
		for (const letter of generateCardName()) {
			let node;
			if ("efghilnoprstuvw".includes(letter)) node = document.createElement("img"), node.src = "_asset/letters/" + letter + ".png", node.alt = letter;
			else if (letter == " ") node = document.createElement("span"), node.className = "space";
			else if (letter == ".") node = document.createElement("img"), node.src = "_asset/letters/period.png", node.alt = ".";
			else node = document.createElement("span"), node.className = "text", node.textContent = letter;
			nameNodes.push(node);
		}
		card.querySelector(".card-name").replaceChildren(...nameNodes);
		card.classList.replace("back-face", "front-face");
		card.classList.remove("untouchable");
		card.animate({transform: ["scaleX(0)", "scaleX(1)"]}, {duration: 1000, easing: "ease-out"});
	});
}

function generateCardName() {
	let name = pickFrom(formats);

	if (name.includes("$THING")) name = name.replace("$THING", pickFrom(things));
	if (name.includes("$CONCEPT")) name = name.replace("$CONCEPT", pickFrom(concepts));
	if (name.includes("$ADJECTIVE")) name = name.replace("$ADJECTIVE", pickFrom(adjectives));

	if (Math.random() > 0.75) name += ".";
	return name;
	
	function pickFrom(array) {return array[Math.floor(Math.random() * array.length)]}
}