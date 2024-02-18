/* audio-player.js by june @ webcatz.neocities.org

how to use:
1. save the script in a javascript file somewhere on your site (e.g. filename.js)
2. include the following tag somewhere in a page's <head></head>:
<script src="filename.js"></script>
3. add a new <script></script>, somewhere after the old one. here's some template code to put inside it:
AudioPlayer.create([
  {title: "Pages of Solemnity - Pseudoregalia OST", src: "https://files.catbox.moe/xl09z8.mp3"},
  {title: "Pages of Solemnity - Pseudoregalia OST", src: "https://files.catbox.moe/xl09z8.mp3"},
  {title: "Pages of Solemnity - Pseudoregalia OST", src: "https://files.catbox.moe/xl09z8.mp3"},
],{
  playButton: document.getElementById("play"),
  skipButton: document.getElementById("skip"),
  title: document.getElementById("title"),
  shuffle: true,
});

3.1. here's a list of all possible settings. all of them are optional!
playButton: HTMLElement, // html element that will toggle playback when clicked
skipButton: HTMLElement, // html element that will skip the current track when clicked
insertIcons: true/false, // inserts icons into the play and skip buttons. false by default
title: HTMLElement, // html element that will display the title of the current track
slider: HTMLElement, // slider that will show audio progress. a <input type="range"> isn't allowed—it should be a custom slider! the script takes care of all the custom slider code, you just need to add a <div role="slider"></div> and style it however you want
sliderThumb: HTMLElement, // thumb shown on the slider. must be inside the slider
sliderProgress: HTMLElement, // progress bar shown on the slider. must be inside the slider
shuffle: true/false, // shuffles the playlist randomly. false by default
onended: Function, // a function that will run every time a track ends. for adding your own functionality

3.2. if you're adding custom functionality, here's a list of AudioPlayer's properties:
audio // the audio object playing the track
list // an array of objects representing the playlist
idx // the current index in the playlist
on(event, func) // runs addEventListener() on the audio oject
next() // ends the current track

*/

const AudioPlayer = {
  audio: new Audio, idx: -1,
  on: function (event, func) {this.audio.addEventListener(event, func)},
  next: function () {AudioPlayer.audio.dispatchEvent(new Event("ended"))},
  create: function (list, options) {
    this.list = list;
    this.on("ended", () => {
      this.idx++;
      this.idx %= this.list.length;
      this.audio.src = this.list[this.idx].src;
      this.audio.play();
    });
    // basic elements (play, skip, title)
    if (options.playButton) {
      options.playButton.addEventListener("click", () => this.audio.paused ? this.audio.play() : this.audio.pause());
      if (options.insertIcons) {
        this.playButton = options.playButton;
        this.playButton.innerHTML = "<svg fill=\"currentcolor\" width=\"1em\" height=\"1em\" style=\"vertical-align: -0.125em; pointer-events: none\" viewBox=\"0 0 384 512\" aria-hidden=\"true\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z\"/></svg>";
        this.on("play", () => {
          this.playButton.innerHTML = "<svg fill=\"currentcolor\" width=\"1em\" height=\"1em\" style=\"vertical-align: -0.125em; pointer-events: none\" viewBox=\"0 0 512 512\" aria-hidden=\"true\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z\"/></svg>";
          this.on("timeupdate", () => this.playButton.innerHTML = "<svg fill=\"currentcolor\" width=\"1em\" height=\"1em\" style=\"vertical-align: -0.125em; pointer-events: none\" viewBox=\"0 0 320 512\" aria-hidden=\"true\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z\"/></svg>", {once: true});
        });
        this.on("pause", () => this.playButton.innerHTML = "<svg fill=\"currentcolor\" width=\"1em\" height=\"1em\" style=\"vertical-align: -0.125em; pointer-events: none\" viewBox=\"0 0 384 512\" aria-hidden=\"true\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z\"/></svg>");
      }
    }
    if (options.skipButton) {
      options.skipButton.addEventListener("click", this.next);
      if (options.insertIcons) options.skipButton.innerHTML = "<svg fill=\"currentcolor\" width=\"1em\" height=\"1em\" style=\"vertical-align: -0.125em; pointer-events: none\" viewBox=\"0 0 512 512\" aria-hidden=\"true\"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d=\"M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z\"/></svg>";
    }
    if (options.title) {
      this.title = options.title;
      this.on("ended", () => this.title.textContent = this.list[this.idx].title);
    }
    // custom slider
    if (options.slider) {
      this.slider = options.slider;
      this.sliderActive = false;
      this.alertSlider = percent => this.slider.dispatchEvent(new CustomEvent("input", {detail: {percent: percent}}));

      this.on("durationchange", () => this.slider.ariaValueMax = this.audio.duration);
      this.on("timeupdate", () => {
        this.slider.ariaValueNow = this.audio.currentTime;
        if (!this.sliderActive) this.alertSlider(this.audio.currentTime / this.audio.duration);
      });

      this.slider.addEventListener("mousedown", () => this.sliderActive = true);
      this.slider.addEventListener("mousemove", e => {
        if (this.sliderActive) this.alertSlider(e.offsetX / this.slider.clientWidth);
      });
      this.slider.addEventListener("mouseup", e => {
        this.sliderActive = false;
        this.slider.ariaValueNow = this.audio.duration * e.offsetX / this.slider.clientWidth;
        this.audio.currentTime = this.slider.ariaValueNow;
      });
  
      if (options.sliderThumb) {
        this.sliderThumb = options.sliderThumb;
        this.slider.addEventListener("input", e => {
          this.sliderThumb.style.left = (this.slider.clientWidth - this.sliderThumb.clientWidth) * e.detail.percent + "px";
        });
      }
      if (options.sliderProgress) {
        this.sliderProgress = options.sliderProgress;
        this.slider.addEventListener("input", e => {
          this.sliderProgress.style.width = this.slider.clientWidth * e.detail.percent + "px";
        });
      }
    }
    // playlist shuffle
    if (options.shuffle) {
      let thisi = this.list.length, randi;
      while (thisi > 0) randi = Math.floor(Math.random() * thisi--), [this.list[thisi], this.list[randi]] = [this.list[randi], this.list[thisi]];
    }
    // custom behavior
    if (options.onended) this.audio.addEventListener("ended", options.onended);
    
    this.next();
    this.audio.pause();
  },
}