// image-modal.js by june @ webcatz.neocities.org

/*

how to use:

1. make a new javascript file (ending with .js) somewhere on your site

2. copy this script into it

3. include the following tag somewhere in a page's <head></head>:
<script defer src="wherever/youre/storing/image-modal.js" data-select="img"></script>

4. set src to the path of the js file you just made

5. set data-select to select which images will have a modal. it works exactly like a css selector

*/

const Modal = {
	select: query => {
		for (const img of document.querySelectorAll(query)) Modal.add(img);
	},
	add: img => {
		img.onclick = Modal.open;
		img.style.cursor = "zoom-in";
	},
	open: function () {
		let modal = document.createElement("img");
		modal.style = "all: unset; width: 100vw; height: 100vh; object-fit: contain; background-color: #00000080; position: fixed; inset: 0; z-index: 10; cursor: zoom-out";
		modal.src = this.src, modal.onclick = modal.remove;
		top.document.body.appendChild(modal);
	}
};
if (document.currentScript.dataset.select) Modal.select(document.currentScript.dataset.select);