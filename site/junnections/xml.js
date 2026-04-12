// a custom xml parser. i find using the domparser for xml unwieldy for simple
// data representations, hence this script!

/// xml parser
const XML = {

	/// fetches a file from a url, parses its contents, and returns it as an xml tree.
	async fetch(url) {
		let response = await fetch(url);
		return this.parse(response.ok ? await response.text() : "");
	},

	/// parses a string and returns it as an xml tree.
	parse(str = "") {
		let root = new XMLNode;
		let node = root;
		let i = 0;
		// repeatedly finds and parses the next tag until the string is consumed
		while (i < str.length) {
			// stores text between tags
			node.text += str.substring(i, i = str.indexOf("<", i));
			// handles tag
			handleTag();
		}
		// removes dummy head node
		root = root.nodes[0];
		root.parent = undefined;
		// returns tree
		return root;

		/// parses various types of tag
		function handleTag() {
			i++;
			if (str.startsWith("!--", i)) i = str.indexOf("-->", i + 3) + 3;
			else if (str[i] === "?") i = str.indexOf("?>", i + 1) + 2;
			else if (str[i] === "/") ascend();
			else if (str[i] !== " ") descend();
			else node.text += "<";
		}

		/// finishes parsing the current node and returns to parsing its parent.
		/// updates the current node.
		function ascend() {
			node.parent.text += node.toString();
			node = node.parent;
			i = str.indexOf(">", i) + 1;
		}

		/// begins parsing a new child node, recording its tag name and attributes.
		/// updates the current node.
		function descend() {
			node = node.child();
			node.tag = str.substring(i, i = find(i => " />".includes(str[i])));
			while (!"/>".includes(str[i])) handleAttribute();
			str[i] === "/" ? ascend() : i++;
		}

		/// parses an attribute and stores it on the current node
		function handleAttribute() {
			let key = str.substring(i, i = str.indexOf("=", i)).trimStart();
			let val = str.substring(i += 2, i = find(i => str[i] === "\"" && str[i - 1] !== "\\"));
			node.attributes[key] = val;
			i++;
		}

		/// finds the next index for which a given check returns true
		function find(check) {
			let j = i;
			while (!check(j)) j++;
			return j;
		}
	},

};

/// a node in an xml tree
class XMLNode {
	tag = "";         /// the tag name of a node
	text = "";        /// the text contained by a node
	attributes = {};  /// the attributes of a node
	nodes = [];       /// the children of a node
	parent;           /// the parent of a node

	/// returns the first child node matching a given path.
	/// the path should be a space-separated list of tag names, each representing a child.
	get(path) {
		return path.split(" ").reduce((node, tag) => {
			return node.nodes.find(child => child.tag === tag);
		}, this);
	}
	
	/// returns all child nodes matching a given path.
	/// the path should be a space-separated list of tag names, each representing a child.
	getAll(path) {
		let [tag, tail] = path.split(" ", 2);
		let nodes = this.nodes.filter(node => node.tag === tag);
		return tail ? nodes.flatMap(node => node.getAll(tail)) : nodes;
	}

	/// adds a new child to this node and returns it.
	child() {
		let node = new XMLNode;
		node.parent = this;
		this.nodes.push(node);
		return node;
	}

	/// converts a node back to its string representation.
	toString() {
		return `<${this.tag}${Object.entries(this.attributes).reduce((str, [k, v]) => str += ` ${k}="${v}"`, "")}` + (this.text ? `>${this.text}</${this.tag}>` : "/>");
	}

}