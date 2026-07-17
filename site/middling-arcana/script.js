const FORMATS = ["THE THING", "THE ADJECTIVE THING", "CONCEPT", "ADJECTIVE CONCEPT", "THING OF CONCEPT", "THING'S CONCEPT"];
const THINGS = ["ANGEL", "ANVIL", "ASHES", "BEAST", "BEGGAR", "BRIDGE", "CHAINS", "CHARIOT", "CLIFF", "CLOCK", "CLOUD", "COMPASS", "CORPSE", "CROWN", "CRYPT", "CUP", "DANCER", "DEPTHS", "DESERT", "DEVIL", "DICE", "DOG", "DOOR", "DOVE", "DUSK", "EARTH", "EMPEROR", "EMPRESS", "END", "ENGINE", "EYE", "FIRES", "FLAME", "FLOWER", "FLUTE", "FLUTER", "FOOL", "FRUIT", "GAMBLER", "GATE", "GRAVE", "GRIP", "HAND", "HAVEN", "HEIR", "HERMIT", "HIEROPHANT", "HOUSE", "HUSK", "JAILER", "JESTER", "KNIFE", "KNIGHT", "LAMB", "LAMP", "LIGHT", "LIGHTHOUSE", "LOCK", "LOOM", "LOVERS", "LUTE", "MACHINE", "MAGICIAN", "MAGUS", "MAN", "MASTER", "MAW", "MAZE", "MEAT", "MOON", "MOUNTAIN", "MUSE", "POISON", "PUPPET", "PRIESTESS", "PRISON", "PRISONER", "ROAD", "RUINS", "SAGE", "SAILOR", "SAND", "SCHOLAR", "SCRIBE", "SEA", "SHEEP", "SHEPHERD", "WRECK", "SKY", "SONG", "SOUL", "SPARK", "SPHINX", "STAR", "STORM", "STRING", "SNOW", "SUN", "SWORD", "TEMPLE", "THEFT", "THIEF", "THREAD", "THRONE", "TIDE", "TOMB", "TOWER", "TRAITOR", "TREE", "TRICK", "VESSEL", "VIGIL", "VOYAGE", "WAVES", "WEB", "WHALE", "WHEEL", "WHISPER", "WIND", "WOLF", "WOMAN", "WOUND"];
const CONCEPTS = ["ACHE", "ART", "ASH", "BREATH", "CHAOS", "CRAFT", "DAY", "DEATH", "DECAY", "DELIRIUM", "DESIRE", "DESPAIR", "DISCORD", "DISGUST", "DUST", "ENDURANCE", "ENVY", "ESCAPE", "FATE", "FEAR", "FILTH", "FLIGHT", "FOLLY", "FORTUNE", "GREED", "HEAVEN", "HUMILITY", "ILLNESS", "INTELLECT", "JOY", "JUDGEMENT", "JUSTICE", "LUST", "MADNESS", "NIGHT", "ORIGIN", "PATIENCE", "PRIDE", "RAGE", "REST", "ROT", "SACRIFICE", "SECRETS", "SILENCE", "SLOTH", "SORROW", "STRANGE", "STRENGTH", "TEMPERANCE", "TRUTH", "UNION", "VIRTUE", "WEAKNESS", "WILL", "WISDOM", "WRATH"];
const ADJECTIVES = ["ABSENT", "ACHING", "ACRID", "ANCIENT", "BLACK", "BLOODY", "BOUND", "BRASS", "BROKEN", "BURNING", "BURNT", "CARELESS", "CHAINED", "CLOUDED", "COLD", "CRACKED", "CRYING", "DAMNED", "DANCING", "DEAD", "DIVINE", "DROWNED", "ETERNAL", "FEATHERED", "FRAIL", "FRAGILE", "GAPING", "GLEAMING", "GOLD", "HANGED", "HIGH", "ICY", "IRON", "LAST", "LONE", "LOST", "LOW", "MIGHTY", "MORTAL", "ODD", "OLD", "RATIONED", "RED", "ROTTED", "SACRED", "SCREAMING", "SHINING", "SILVER", "SPENT", "STILL", "STONE", "STRANGE", "SUBTLE", "TORN", "TRUE", "UNHOLY", "VEILED", "WATCHFUL", "WHITE", "WINGED", "WOUNDED"];

const ART = ["00-fool", "01-magician", "02-high-priestess", "03-empress", "04-emperor", "05-hierophant", "06-lovers", "07-chariot", "08-strength", "09-hermit", "10-wheel-of-fortune", "11-justice", "12-hanged-man", "13-death", "14-temperance", "15-devil", "16-tower", "17-star", "18-moon", "19-sun", "20-judgement", "21-world"];
const ART_WIDTH = 286;
const ART_HEIGHT = 476;
const ART_CELL_WIDTH = ART_WIDTH / 2;
const ART_CELL_HEIGHT = ART_HEIGHT / 3;

function randomizeCard(card) {
	let content = document.createElement("div");
	content.classList.add("card-content");
	card.replaceChildren(content);

	let art = content.appendChild(document.createElement("canvas"));
	art.classList.add("card-art");
	art.width = ART_WIDTH;
	art.height = ART_HEIGHT;

	let title = FORMATS[Math.floor(Math.random() * FORMATS.length)]
		.replace("THING", THINGS[Math.floor(Math.random() * THINGS.length)])
		.replace("CONCEPT", CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)])
		.replace("ADJECTIVE", ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]);
	if (Math.random() < 0.25) title += ".";

	let label = content.appendChild(document.createElement("div"));
	label.classList.add("card-label");
	label.append(...title.split(" ").map(word => {
		let wordEl = document.createElement("span");
		wordEl.classList.add("word");
		wordEl.append(...Array.from(word).map(letter => {
			if ("EFGHILNOPRSTUVW".includes(letter)) {
				let img = document.createElement("img");
				img.src = "assets/letters/" + letter.toLowerCase() + ".png";
				img.alt = letter;
				return img;
			} else if (letter === ".") {
				let img = document.createElement("img");
				img.src = "assets/letters/period.png";
				img.alt = ".";
				return img;
			} else return letter;
		}));
		return wordEl;
	}));

	let ctx = art.getContext("2d");
	for (let i = 0; i < 6; i++) {
		let img = new Image();
		img.src = `assets/art/${ART[Math.floor(Math.random() * ART.length)]}.png`;
		img.onload = () => {
			let x = ART_CELL_WIDTH * (i % 2);
			let y = ART_CELL_HEIGHT * Math.floor(i / 2);
			ctx.drawImage(img, x, y, ART_CELL_WIDTH, ART_CELL_HEIGHT, x, y, ART_CELL_WIDTH, ART_CELL_HEIGHT);
		}
	}
}

async function flipCard() {
	this.classList.add("flipping");
	await this.animate({scale: ["1 1", "0 1"]}, {duration: 750, easing: "ease-in"}).finished;
	this.classList.remove("flipped");
	randomizeCard(this);
	await this.animate({scale: ["0 1", "1 1"]}, {duration: 500, easing: "ease-out"}).finished;
	this.classList.remove("flipping");
}

let i = 0;
for (const card of document.getElementsByClassName("card")) {
	card.addEventListener("click", flipCard);
	setTimeout(() => card.click(), 250 * i++);
}