var modal, prev, display, comment, next, images, current;
function createModal(list, options) {
  document.body.insertAdjacentHTML("beforeend", `<div id="modal" class="hidden">
    <button id="modal-prev"><i class="fa-solid fa-chevron-left"></i></button>
    <img id="modal-img">
    <div id="modal-caption"></div>
    <button id="modal-next"><i class="fa-solid fa-chevron-right"></i></button>
  </div>`);
  modal = document.getElementById("modal"), [prev, display, comment, next] = modal.children;
  modal.onclick = () => modal.classList.add("hidden");
  prev.onclick = e => {e.stopPropagation(); switchModalImg(-1)};
  next.onclick = e => {e.stopPropagation(); switchModalImg(1)};
  onkeydown = e => {if (!modal.classList.contains("hidden")) {
    if (e.key == "ArrowLeft") switchModalImg(-1);
    else if (e.key == "ArrowRight") switchModalImg(1);
  }};

  modal.style.color = options.color;
  modal.style.backgroundColor = options.bgColor + "60";
  comment.style.backgroundColor = options.bgColor;
  modal.style.setProperty("--active", options.color + "10");
  modal.style.setProperty("--disabled", options.color + "40");

  images = list;
  for (let i = 0; i < images.length; i++) images[i].onclick = () => openModal(i);
}
function openModal(i) {
  current = i;
  setModalImg(images[i].src);
  modal.classList.remove("hidden");
}
function switchModalImg(i) {
  if (current + i < 0 || current + i > images.length - 1) return;
  current += i;
  display.animate({opacity: 0, transform: "translateX(-" + Math.sign(i) * 32 + "px)"}, {duration: 75, easing: "ease-in"}).finished.then(() => {
    setModalImg(images[current].src);
    display.animate({opacity: ["0", "1"], transform: ["translateX(" + Math.sign(i) * 32 + "px)", "none"]}, {duration: 75, easing: "ease-out"})
  });
}
function setModalImg(src) {
  display.src = "", display.src = src;
  if (images[current].title) {
    comment.innerHTML = images[current].title.replace("\n", "<br>");
    comment.classList.remove("hidden");
  } else comment.classList.add("hidden");
  prev.disabled = current == 0, next.disabled = current == images.length - 1;
}