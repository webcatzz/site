let h1 = document.querySelector("h1");
let h1Text = document.getElementById("h1-text");

// h1Text.style.scale = h1.offsetWidth / h1Text.offsetWidth * 0.5;
h1Text.style.scale = h1.offsetWidth / h1Text.offsetWidth + " " + h1.offsetHeight / h1Text.offsetHeight;