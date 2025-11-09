const fs = {
	"scribblings": {
		"sonny_boy.txt": "in the house of a gambler\nthe old man claws my face\ndrizzling spittle from cracked lips\nhe dissolves\ngapes and gasps and revvs into a croak\n\"boy, sonny boy,\"\n—fingers straining tight my loose skin—\n\"kiss me: i love you,\ni love you,\ni love you,\"\nabruptly releases me\nand casts his hand to heaven\neyes glossy as his hard-won marbles\nreflecting the soft orange of a cigarette butt below\nthe fire does not spare him when it comes",
	},
	"logs": {
		"2025.04.20.txt": "everything is spiraling down again. point i can't seem to get away from",
	},
	"proj": {
		"a.txt": "\tbeen thinking about my projects again. i really want to give cat comic a proper plot. i keep getting distracted thinking about the world and to some degree the characters so i never get to it but i want one.\n\talso bad dream. i'm going home for the summer so if i can finish something concrete over that three-month period that would be really nice. i've said this before but if i can just finish a battle system demo that feels fun i'll be happy. my gamedev course here has taught me plenty about planning and scoping so hopefully i'll actually manage to pull it off this time"
	},
	"albums.txt": "i will eventually put up up an albums page with commentary and sweet pics but this is good for now\n\nmy faves (no particular order)\npainted shut\thop along\nschlagenheim\tblack midi\ncavalcade\tblack midi\ntwin fantasy\tcar seat headrest\nplastic death\tglass beach\nforest spirit, sun on your back\nrug\t\trugh\n\non vinyl (in order of acquisition)\nplastic death\tglass beach\nthe new sound\tgeordie greep\npainted shut\thop along\t2025.04.19\n\n\ti started collecting vinyl with plastic death. its vinyl release is utterly gorgeous — if you haven't seen it, you really should — i bought it immediately because come on. when it came i was too scared to open it for several days.\n\thowever at this point i did not in fact own a means to play it. after i got to uni i talked about procuring one to my dear friend ardenna who promptly offered to send me his sister's old record player for free. what news! they sent it over and i set it up and then did not play anything on it for several months.\n\tmy friend alex ended up gifting me my next vinyl. the new sound had just released and i was very into it, so for secret santa he bought it for me! very kind of him. it ended up coming pretty late — we listened to it together for the first time right before spring break. i think i blogged about this.\n\ti scored painted shut for 16 whole dollars at a record fair. it was a nice record i have no idea why they were pricing it so low i got a poster and a free download code and everything. was it because it's on pink vinyl? it fucks\n\ti continue to be haunted by a black midi hellfire record that crops up wherever i go. on one hand its nice to see black midi in record shops on the other hand pleaseeee stock the other albums i would buy cavalcade on the spot\n\tin the future i'd like to collect more cds than vinyls but vinyls continue to be funnn ^_^",
	"abt.txt": "place to store contents of pages i haven't made yet or stuff i don't want that many people to see",
};


const cmd = {

	log(text = "") {
		let el = document.getElementById("log").appendChild(document.createElement("div"));
		el.append(text ? text : document.createElement("br"));
	},

	// path

	path: [],

	at: path => path.reduce((dir, name) => dir ? dir[name] : dir, fs),
	
	parsePath(str) {
		let path = str.startsWith("/") ? [] : [...cmd.path];
		for (const name of str.split("/")) if (name) {
			if (name == ".") continue;
			if (name == "..") path.pop();
			else path.push(name);
		}
		return path;
	},

	// line

	line: "",
	caret: 0,

	moveCaretTo(idx) {
		cmd.caret = Math.max(0, Math.min(cmd.line.length, idx));
	},
	
	moveCaret(by = 0) {
		cmd.moveCaretTo(cmd.caret + by);
	},

	updateInput() {
		let input = document.getElementById("input");
		let prefix = `/${cmd.path.join("/")} $ `;
		input.textContent = prefix + cmd.line;
		input.style.setProperty("--caret", cmd.caret + prefix.length);
		input.scrollIntoView();
	},

	// commands

	commands: {

		help() {
			cmd.log("cat <path>: print file contents");
			cmd.log("cd <path>: change directory");
			cmd.log("greg: greg");
			cmd.log("ls <path>: list directory contents");
		},

		cd(str = "/") {
			let path = cmd.parsePath(str);
			let x = cmd.at(path);
			if (!x) cmd.log("cd: no such file or directory: " + str);
			else if (typeof x != "object") cmd.log("cd: not a directory: " + str)
			else cmd.path = path;
		},

		ls(str = "") {
			let x = cmd.at(cmd.parsePath(str));
			if (!x) cmd.log(`ls: ${str}: No such file or directory`);
			else if (typeof x != "object") cmd.log(str);
			else cmd.log(Object.keys(x).map((x, i) => x + ((i + 1) % 4 ? "\t" : "\n")).join(""))
		},

		cat(str = "") {
			let x = cmd.at(cmd.parsePath(str));
			if (!x) cmd.log(`cat: ${str}: No such file or directory`)
			else if (typeof x == "object") cmd.log(`cat: ${str}: Is a directory`);
			else cmd.log(x);
		},

		greg() {
			let img = document.getElementById("log").appendChild(document.createElement("img"));
			if (Math.random() > 0.5) {
				img.src = "assets/dace.png";
				cmd.log("Now see him tranquil.");
			}
			else {
				img.src = "assets/dase.png";
				cmd.log("Now see him wrathful.");
			}
		},

		clear() {
			document.getElementById("log").textContent = "";
			cmd.log("Enter \"help\" for a list of commands");
		},

	},

	run() {
		cmd.log(`/${cmd.path.join("/")} $ ${cmd.line}`);
		if (cmd.line) {
			let [key, ...args] = cmd.line.split(" ").filter(x => x);
			key in cmd.commands ? cmd.commands[key](...args) : cmd.log("jsh: command not found: " + key);
			cmd.history.push(cmd.line);
			cmd.moveHistoryTo(cmd.history.length);
		}
	},

	// history

	history: [],
	historyIdx: 0,

	moveHistoryTo(idx) {
		cmd.historyIdx = Math.max(0, Math.min(cmd.history.length, idx));
		cmd.line = cmd.history[cmd.historyIdx] ?? "";
		cmd.moveCaretTo(cmd.line.length);
	},

	moveHistory(by) {
		cmd.moveHistoryTo(cmd.historyIdx + by);
	},
	
}


addEventListener("keydown", e => {
	if (e.key == "Enter") cmd.run();
	else if (e.key == "ArrowLeft") cmd.moveCaret(-1);
	else if (e.key == "ArrowRight") cmd.moveCaret(1);
	else if (e.key == "ArrowUp") cmd.moveHistory(-1);
	else if (e.key == "ArrowDown") cmd.moveHistory(1);
	else if (e.key == "Backspace") {
		cmd.line = cmd.line.substring(0, cmd.caret - 1) + cmd.line.substring(cmd.caret);
		cmd.moveCaret(-1);
	}
	else if (e.key.length == 1) {
		cmd.line = cmd.line.substring(0, cmd.caret) + e.key + cmd.line.substring(cmd.caret);
		cmd.moveCaret(1);
	}
	cmd.updateInput();
	e.preventDefault();
});


cmd.commands.clear();