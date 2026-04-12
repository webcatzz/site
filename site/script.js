let openSummary;

function onSummaryClicked() {
	if (this.parentElement.open) {
		openSummary = null;
	} else {
		openSummary?.click();
		openSummary = this;
	}
}

for (const summary of document.getElementsByTagName("summary")) {
	summary.addEventListener("click", onSummaryClicked);
}