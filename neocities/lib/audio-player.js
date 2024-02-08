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
noIcon: true/false, // set this to true unless you have a fontawesome icon inside the playButton. false by default
skipButton: HTMLElement, // html element that will skip the current track when clicked
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
      if (!options.noIcon) {
        this.playIcon = options.playButton.querySelector("i");
        this.on("play", () => {
          this.playIcon.className = "fa-solid fa-spinner fa-spin-pulse";
          this.on("timeupdate", () => this.playIcon.className = "fa-solid fa-pause", {once: true});
        })
        this.on("pause", () => this.playIcon.className = "fa-solid fa-play");
      }
    }
    if (options.skipButton) options.skipButton.addEventListener("click", this.next);
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