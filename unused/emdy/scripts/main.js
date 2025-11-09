const emdy = {

	async load(path) {
		editor.write(await (await fetch(path)).text());
		nav.setActive(nav.getItem(path));
	}

}

nav.addFile("test.md");
nav.addFile("test2.md");