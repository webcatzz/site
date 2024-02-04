let nav = document.querySelector("nav");
let navLayer = 2, currentNavList = nav.appendChild(document.createElement("ul"));
for (const heading of document.querySelectorAll("h2, h3")) {
  heading.id = heading.textContent.replaceAll(" ", "_");
  
  let newLayer = Number(heading.tagName.slice(-1));
  if (navLayer < newLayer) navLayer = newLayer, currentNavList = currentNavList.lastElementChild.appendChild(document.createElement("ul"));
  else while (navLayer > newLayer) {
    currentNavList = currentNavList.parentElement.parentElement;
    navLayer--;
  }
  
  let link = currentNavList.appendChild(document.createElement("li")).appendChild(document.createElement("a"));
  link.textContent = heading.textContent, link.href = "#" + heading.id, link.target = "_self";
}