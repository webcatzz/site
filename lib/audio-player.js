// audio-player.js by june @ webcatz.neocities.org
// copy to your website, don't hotlink!

/* HOW TO USE:

1. paste the following HTML just before your "</body>" tag:
  <script src="path to the .js file"></script>
  <script>
    createAudioPlayer([
      // playlist
    ],{
      // settings
    });
  </script>

2. in place of "// playlist", insert your playlist. format your tracks like so:
  {title: "song 1", link: "source url"},
  {title: "song 2", link: "source url"},
  {title: "song 3", link: "source url"},
etc.

3. in place of "// settings", add the player's settings. every property is optional, use what you need. refer to the list of valid properties below:
  playButton: HTMLElement, (the element you click to start audio playback)
  skipButton: HTMLElement, (the element you click to skip to the next track)
  title: HTMLElement, (the element in which the current track's title is displayed)
  source: HTMLElement, (if you would like a track's title and source to be displayed separately, set this property to the element in which the current track's source is displayed and add a "source" property to every track in the playlist.)
  shuffle: true/false, (enables playlist shuffle. false by default)
  titleWrapsMarquee: true/false, (wraps title in marquee. false by default)
  verticalMarquee: true/false, (makes titleWrapsMarquee marquee scroll vertically. false by default, requires titleWrapsMarquee to be true)
  onAudioEnded: function, (called every time a track ends and another begins. for adding extra functionality)
for example, a simple set-up would be:
  {
    playButton: document.getElementById("audio-play"),
    skipButton: document.getElementById("audio-skip"),
    title: document.getElementById("audio-title"),
  }

4. voila! you're done.
if you would like some play/pause/skip icons: this code is designed to work with fontawesome.com's free icons. just insert the icon elements inside your playButton and/or skipButton.

*/

const audio = new Audio;
var playlist, playlistIdx = -1, audioTitle, playIcon;
function createAudioPlayer(pl, options) {
  playlist = pl, audio.onended = () => {
    playlistIdx++;
    if (playlistIdx >= playlist.length) playlistIdx = 0;
    audio.src = playlist[playlistIdx].link;
    audio.play();
  };
  
  if (options.playButton) {
    options.playButton.onclick = () => audio.paused ? audio.play() : audio.pause();
    if (playIcon = options.playButton.querySelector("i")) audio.onplay = () => {
      playIcon.className = "fa-solid fa-spinner fa-spin-pulse";
      audio.addEventListener("timeupdate", () => playIcon.className = "fa-solid fa-pause", {once: true})
    }, audio.onpause = () => playIcon.className = "fa-solid fa-play";
  }
  if (options.skipButton) options.skipButton.onclick = () => audio.dispatchEvent(new Event("ended"));
  if (options.title) {
    audioTitle = options.title;
    if (options.titleWrapsMarquee) {
      if (options.verticalMarquee) audio.addEventListener("ended", () => audioTitle.innerHTML = "<marquee direction='up'><span>" + playlist[playlistIdx].title + "</span></marquee>");
      else audio.addEventListener("ended", () => audioTitle.innerHTML = "<marquee>" + playlist[playlistIdx].title + "</marquee>");
    } else audio.addEventListener("ended", () => audioTitle.textContent = playlist[playlistIdx].title);
  }
  if (options.source) audio.addEventListener("ended", () => options.source.textContent = playlist[playlistIdx].source);
  if (options.shuffle) {
    let thisi = playlist.length, randi;
    while (thisi > 0) randi = Math.floor(Math.random() * thisi--), [playlist[thisi], playlist[randi]] = [playlist[randi], playlist[thisi]];
  }
  if (options.onAudioEnded) audio.addEventListener("ended", options.onAudioEnded);
  audio.dispatchEvent(new Event("ended"));
  audio.pause();
}