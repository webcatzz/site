const bb = document.getElementById("bb");
const count = document.getElementById("count");
var clicks = 0;

class BB extends HTMLImageElement {
	direction;
	position;
	connectedCallback() {
		this.className = "tinybb";
		this.src = "_asset/dance.gif";
		if (Math.random() > 0.5) this.style.scale = "-1 1";
		this.direction = {x: Math.random() * 4 - 2, y: Math.random() * 4 - 2};
		this.position = {x: this.offsetLeft, y: this.offsetTop};
		setInterval(() => {this.process()}, 0.1);
	}
	process() {
		this.position.x += this.direction.x;
		this.position.y += this.direction.y;
		this.style.left = this.position.x + "px";
		this.style.top = this.position.y + "px";
		if (this.position.x < 0 || this.position.x > innerWidth - 64) this.direction.x = -this.direction.x;
		if (this.position.y < 0 || this.position.y > innerHeight - 64) this.direction.y = -this.direction.y;
	}
}
customElements.define("dancing-bb", BB, {extends: "img"});


bb.onclick = () => {
	count.textContent = `you have clicked bb ${numToString(++clicks)} times.`;
	document.body.appendChild(document.createElement("img", {is: "dancing-bb"}));
}


function numToString(num) {
	if (num < 20) return ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"][num];
	if (num < 100) return ["twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"][fit(10, num) - 2] + (last(1, num) ? "-" + numToString(last(1, num)) : "");
	if (num < 1000) return numToString(fit(100, num)) + " hundred " + numToString(last(2, num));
	if (num < 1000000) return numToString(fit(1000, num)) + " thousand " + numToString(last(3, num));
	else {
		let order = Math.floor(Math.log10(num) / 3);
		let pow = order * 3;
		return numToString(fit(ten(pow), num)) + " " + [
			"m", "b", "tr", "quadr", "quint", "sext", "sept", "oct", "non", "dec", "undec", "duodec", "tredec", "quattuordec"
		][order - 2] + "illion " + numToString(last(pow, num));
	}
}


function numToString2(num) {
	if (num < 100) return ["twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"][fit(10, num) - 2] + (last(1, num) ? "-" + numToString(last(1, num)) : "");
	if (num < 1000) return numToString(fit(100, num)) + " hundred " + numToString(last(2, num));
	if (num < 1000000) return numToString(fit(1000, num)) + " thousand " + numToString(last(3, num));
	else {
		let order = Math.floor(Math.log10(num) / 3);
		let pow = order * 3;
		return numToString(fit(ten(pow), num)) + " " + [
			"m", "b", "tr", "quadr", "quint", "sext", "sept", "oct", "non", "dec", "undec", "duodec", "tredec", "quattuordec"
		][order - 2] + "illion " + numToString(last(pow, num));
	}
}


function ten(pow) {
	return Math.pow(10, pow);
}


function fit(num, in_num) {
	return Math.floor(in_num / num);
}


function last(num, of_num) {
	return of_num % ten(num);
}