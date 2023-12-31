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