for (const article of document.getElementsByTagName("article")) {
	let btn = article.querySelector(".comments-btn");
	let comments = article.querySelector(".comments");
	if (!btn || !comments) continue;
	btn.addEventListener("click", function() {
		if (comments.classList.toggle("hidden")) {
			btn.textContent = "(show comments)";
		}
		else {
			btn.textContent = "(hide comments)";
		}
	});
}