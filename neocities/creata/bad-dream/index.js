for (const time of document.getElementsByTagName("time")) {
	time.textContent = time.dateTime.replaceAll("-", ".");
}