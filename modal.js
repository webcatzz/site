var modal, prev, display, comment, next, images, current;
function createModal(list, color, bgColor) {
  document.body.insertAdjacentHTML("beforeend", `<div id="modal" class="hidden">
    <button id="modal-prev"><i class="fa-solid fa-chevron-left"></i></button>
    <img id="modal-img">
    <div id="modal-comment"></div>
    <button id="modal-next"><i class="fa-solid fa-chevron-right"></i></button>
  </div>`);
  modal = document.getElementById("modal"), [prev, display, comment, next] = modal.children;
  modal.onclick = () => modal.classList.add("hidden");
  prev.onclick = e => {e.stopPropagation(); switchModalImg(-1)};
  next.onclick = e => {e.stopPropagation(); switchModalImg(1)};

  modal.style.color = color;
  modal.style.backgroundColor = bgColor + "60";
  comment.style.backgroundColor = bgColor;
  modal.style.setProperty("--active", color + "10");
  modal.style.setProperty("--disabled", color + "40");

  images = list;
  for (let i = 0; i < images.length; i++) images[i].onclick = () => openModal(i);
}
function openModal(i) {
  current = i;
  setModalImg(images[i].src);
  modal.classList.remove("hidden");
}
function switchModalImg(i) {
  current += i;
  display.animate({opacity: 0, transform: "translateX(-" + Math.sign(i) * 32 + "px)"}, {duration: 75, easing: "ease-in"}).finished.then(() => {
    setModalImg(images[current].src);
    display.animate({opacity: ["0", "1"], transform: ["translateX(" + Math.sign(i) * 32 + "px)", "none"]}, {duration: 75, easing: "ease-out"})
  });
}
function setModalImg(src) {
  display.src = "", display.src = src;
  if (images[current].title) {
    comment.textContent = images[current].title;
    comment.classList.remove("hidden");
  } else comment.classList.add("hidden");
  prev.disabled = current == 0, next.disabled = current == images.length - 1;
}