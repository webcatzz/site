const midi = {}
midi.context = new AudioContext();

midi.frequencies = [
	261.63,
	293.66,
	329.63,
	349.23,
	392,
	440,
	493.88,
	523.25,
];

midi.start = i => {
	let oscillator = midi.context.createOscillator();
	oscillator.type = "square";
	oscillator.frequency.value = midi.frequencies[i];
	oscillator.connect(midi.context.destination);

	oscillator.start();
	midi[i] = oscillator;
};
midi.stop = i => {
	midi[i].stop();
};

addEventListener("click", () => {
	midi.context.resume().then(() => {
		let gainNode = midi.context.createGain();
		gainNode.gain.value = 0.1;
		gainNode.connect(midi.context.destination);

		onkeydown = e => {
			if (!e.repeat) midi.start(Number(e.key) - 1);
		}
		onkeyup = e => {
			if (!e.repeat) midi.stop(Number(e.key) - 1);
		}
	});
}, {once: true});