// node

class XMLNode {
	tag = "";
	text = "";
	attributes = {};
	nodes = [];
	parent;

	get(path) {
		return path.split(" ").reduce((node, tag) => {
			return node.nodes.find(child => child.tag === tag);
		}, this);
	}

	getAll(path) {
		let [tag, tail] = path.split(" ", 2);
		let nodes = this.nodes.filter(node => node.tag === tag);
		return tail ? nodes.flatMap(node => node.getAll(tail)) : nodes;
	}

	child() {
		let node = new XMLNode;
		node.parent = this;
		this.nodes.push(node);
		return node;
	}

	toString() {
		return `<${this.tag}${Object.entries(this.attributes).reduce((str, [k, v]) => str += ` ${k}="${v}"`, "")}` + (this.text ? `>${this.text}</${this.tag}>` : "/>");
	}
}

// manager

const XML = {

	async fetch(file) {
		let response = await fetch(file);
		return this.parse(response.ok ? await response.text() : "");
	},

	parse(str = "") {
		let root = new XMLNode;
		let node = root;
		let i = 0;

		while (i < str.length) {
			node.text += str.substring(i, i = str.indexOf("<", i));
			handleTag();
		}

		root = root.nodes[0];
		root.parent = undefined;
		return root;

		function handleTag() {
			i++;
			if (str.startsWith("!--", i)) i = str.indexOf("-->", i + 3) + 3;
			else if (str[i] === "?") i = str.indexOf("?>", i + 1) + 2;
			else if (str[i] === "/") ascend();
			else if (str[i] !== " ") descend();
			else node.text += "<";
		}

		function ascend() {
			node.parent.text += node.toString();
			node = node.parent;
			i = str.indexOf(">", i) + 1;
		}

		function descend() {
			node = node.child();
			node.tag = str.substring(i, i = find(i => " />".includes(str[i])));
			while (!"/>".includes(str[i])) handleAttribute();
			str[i] === "/" ? ascend() : i++;
		}
		
		function handleAttribute() {
			let key = str.substring(i, i = str.indexOf("=", i)).trimStart();
			let val = str.substring(i += 2, i = find(i => str[i] === "\"" && str[i - 1] !== "\\"));
			node.attributes[key] = val;
			i++;
		}

		function find(callback) {
			let j = i;
			while (!callback(j)) j++;
			return j;
		}
	},

};