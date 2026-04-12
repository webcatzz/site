const formats = ["THE THING", "THE ADJECTIVE THING", "CONCEPT", "ADJECTIVE CONCEPT", "THING OF CONCEPT", "THING'S CONCEPT"];
const things = ["ANGEL", "ANVIL", "ASHES", "BEAST", "BEGGAR", "BRIDGE", "CHAINS", "CHARIOT", "CLIFF", "CLOCK", "CLOUD", "COMPASS", "CORPSE", "CROWN", "CRYPT", "CUP", "DANCER", "DEPTHS", "DESERT", "DEVIL", "DICE", "DOG", "DOOR", "DOVE", "DUSK", "EARTH", "EMPEROR", "EMPRESS", "END", "ENGINE", "EYE", "FIRES", "FLAME", "FLOWER", "FLUTE", "FLUTER", "FOOL", "FRUIT", "GAMBLER", "GATE", "GRAVE", "GRIP", "HAND", "HAVEN", "HEIR", "HERMIT", "HIEROPHANT", "HOUSE", "HUSK", "JAILER", "JESTER", "KNIFE", "KNIGHT", "LAMB", "LAMP", "LIGHT", "LIGHTHOUSE", "LOCK", "LOOM", "LOVERS", "LUTE", "MACHINE", "MAGICIAN", "MAGUS", "MAN", "MASTER", "MAW", "MAZE", "MEAT", "MOON", "MOUNTAIN", "MUSE", "POISON", "PUPPET", "PRIESTESS", "PRISON", "PRISONER", "ROAD", "RUINS", "SAGE", "SAILOR", "SAND", "SCHOLAR", "SCRIBE", "SEA", "SHEEP", "SHEPHERD", "WRECK", "SKY", "SONG", "SOUL", "SPARK", "SPHINX", "STAR", "STORM", "STRING", "SNOW", "SUN", "SWORD", "TEMPLE", "THEFT", "THIEF", "THREAD", "THRONE", "TIDE", "TOMB", "TOWER", "TRAITOR", "TREE", "TRICK", "VESSEL", "VIGIL", "VOYAGE", "WAVES", "WEB", "WHALE", "WHEEL", "WHISPER", "WIND", "WOLF", "WOMAN", "WOUND"];
const concepts = ["ACHE", "ART", "ASH", "BREATH", "CHAOS", "CRAFT", "DAY", "DEATH", "DECAY", "DELIRIUM", "DESIRE", "DESPAIR", "DISCORD", "DISGUST", "DUST", "ENDURANCE", "ENVY", "ESCAPE", "FATE", "FEAR", "FILTH", "FLIGHT", "FOLLY", "FORTUNE", "GREED", "HEAVEN", "HUMILITY", "ILLNESS", "INTELLECT", "JOY", "JUDGEMENT", "JUSTICE", "LUST", "MADNESS", "NIGHT", "ORIGIN", "PATIENCE", "PRIDE", "RAGE", "REST", "ROT", "SACRIFICE", "SECRETS", "SILENCE", "SLOTH", "SORROW", "STRANGE", "STRENGTH", "TEMPERANCE", "TRUTH", "UNION", "VIRTUE", "WEAKNESS", "WILL", "WISDOM", "WRATH"];
const adjectives = ["ABSENT", "ACHING", "ACRID", "ANCIENT", "BLACK", "BLOODY", "BOUND", "BRASS", "BROKEN", "BURNING", "BURNT", "CARELESS", "CHAINED", "CLOUDED", "COLD", "CRACKED", "CRYING", "DAMNED", "DANCING", "DEAD", "DIVINE", "DROWNED", "ETERNAL", "FEATHERED", "FRAIL", "FRAGILE", "GAPING", "GLEAMING", "GOLD", "HANGED", "HIGH", "ICY", "IRON", "LAST", "LONE", "LOST", "LOW", "MIGHTY", "MORTAL", "ODD", "OLD", "RATIONED", "RED", "ROTTED", "SACRED", "SCREAMING", "SHINING", "SILVER", "SPENT", "STILL", "STONE", "STRANGE", "SUBTLE", "TORN", "TRUE", "UNHOLY", "VEILED", "WATCHFUL", "WHITE", "WINGED", "WOUNDED"];

function generateName() {
	let name = pick(formats)
		.replace("THING", pick(things))
		.replace("CONCEPT", pick(concepts))
		.replace("ADJECTIVE", pick(adjectives));
	if (Math.random() < 0.25) name += ".";
	return name;

	function pick(array) { return array[Math.floor(Math.random() * array.length)]; }
}

async function cardFlip() {
	this.classList.add("flipping");
	await this.animate({scale: ["1 1", "0 1"]}, {duration: 750, easing: "ease-in"}).finished;
	
	this.classList.remove("flipped");
	this.replaceChildren(...generateName().split(" ").map(word => {
		let el = document.createElement("span");
		el.classList.add("word");
		el.append(...Array.from(word).map(letter => {
			if ("EFGHILNOPRSTUVW".includes(letter)) {
				let el = document.createElement("img");
				el.src = "assets/letters/" + letter.toLowerCase() + ".png";
				el.alt = letter;
				return el;
			}
			else if (letter === ".") {
				let el = document.createElement("img");
				el.src = "assets/letters/period.png";
				el.alt = ".";
				return el;
			}
			return letter;
		}));
		return el;
	}));

	await this.animate({scale: ["0 1", "1 1"]}, {duration: 500, easing: "ease-out"}).finished;
	this.classList.remove("flipping");
}

let i = 0;
for (const card of document.getElementsByClassName("card")) {
	card.addEventListener("click", cardFlip);
	setTimeout(() => card.click(), 250 * i++);
}