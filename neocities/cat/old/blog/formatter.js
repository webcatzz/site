// grabbing content
let main = document.createElement("main");
main.replaceChildren(...document.body.children);

// header
let header = document.createElement("header");
header.id = "header";
let headerLink = header.appendChild(document.createElement("a"));
headerLink.textContent = "cat comic", headerLink.href = "../index.html";
document.body.appendChild(header);

// main
document.body.appendChild(main);

// footer
let footer = document.createElement("footer");
let form = footer.appendChild(document.createElement("a"));
form.id = "form", form.className = "panel hover-shadow", form.target = "_blank", form.href = "https://docs.google.com/forms/d/e/1FAIpQLSeeIqINVy5WQERDHibm1DwNpjj8ir2l5rGEfotypVgYYD9YVg/viewform";
let formLabel = form.appendChild(document.createElement("div")), formLabelItalics = formLabel.appendChild(document.createElement("i"));
formLabel.className = "pixel", formLabelItalics.textContent = "suggestions";
formLabel.append("questions? comments? ", formLabelItalics, "?");
form.appendChild(document.createElement("div")).textContent = "send them in here!";
let back = footer.appendChild(document.createElement("a"));
back.id = "back", back.textContent = "← back to index...", back.className = "panel hover-shadow", back.href = "../index.html";
document.body.appendChild(footer);