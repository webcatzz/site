/* image-modal.js by june @ webcatz.neocities.org

how to use:
1. save the script in a javascript file somewhere on your site (e.g. filename.js)
2. include the following tag somewhere in a page's <head></head>:
<script defer src="filename.js" data-select="img"></script>
3. data-select selects the images that will have a modal. works exactly like a css selector

*/

for (const el of document.querySelectorAll(document.currentScript.dataset.select))
  el.onclick = openImg, el.style.cursor = "zoom-in";

function openImg() {
  let modal = document.createElement("img");
  modal.style = "all: unset; width: 100vw; height: 100vh; object-fit: contain; background-color: #00000080; position: fixed; inset: 0; z-index: 10; cursor: zoom-out";
  modal.src = this.src, modal.onclick = this.remove;
  document.body.appendChild(modal);
}