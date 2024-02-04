for (const el of document.querySelectorAll(document.currentScript.dataset.select))
  el.onclick = openImg, el.style.cursor = "zoom-in";

function openImg() {
  let modal = document.createElement("img");
  modal.style = "all: unset; width: 100vw; height: 100vh; object-fit: contain; background-color: #00000080; position: fixed; inset: 0; z-index: 10; cursor: zoom-out";
  modal.src = this.src, modal.onclick = this.remove;
  document.body.appendChild(modal);
}