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

for (const el of document.querySelectorAll(document.currentScript.dataset.select ?? "img")) addImg(el);
function addImg(img) {
	img.onclick = openImg;
	img.style.cursor = "zoom-in";
}
function openImg() {
  let modal = document.createElement("img");
  modal.style = "all: unset; width: 100vw; height: 100vh; object-fit: contain; background-color: #00000080; position: fixed; inset: 0; z-index: 10; cursor: zoom-out";
  modal.src = this.src, modal.onclick = this.remove;
  document.body.appendChild(modal);
}