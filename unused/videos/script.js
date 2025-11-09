document.body.style.setProperty("--gradient-1", `rgb(${Math.random() * 255} ${Math.random() * 255} ${Math.random() * 255})`);
document.body.style.setProperty("--gradient-2", `rgb(${Math.random() * 255} ${Math.random() * 255} ${Math.random() * 255})`);

document.querySelector("video").src = [
	"https://file.garden/ZdmFgugxzVCR-8Bl/site/carjacked.mov",
	"https://file.garden/ZdmFgugxzVCR-8Bl/site/kiss-ross.mp4",
	"https://file.garden/ZdmFgugxzVCR-8Bl/site/evil.mp4",
	"https://file.garden/ZdmFgugxzVCR-8Bl/site/haunted-house.mp4",
	"https://file.garden/ZdmFgugxzVCR-8Bl/site/ed-edd-n-eddy.mp4",
][Math.floor(Math.random() * 5)];
document.querySelector("video").addEventListener("ended", () => location.reload());