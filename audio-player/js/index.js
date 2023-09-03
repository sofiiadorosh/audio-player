import songs from "../songs.json" assert { type: "json" };

const controls = {
  play: document.querySelector(".audio__control-play"),
  backward: document.querySelector(".audio__control-backward"),
  forward: document.querySelector(".audio__control-forward"),
  track: document.querySelector(".audio__track_active"),
  cover: document.querySelector(".audio__cover"),
  background: document.querySelector(".audio"),
  time: document.querySelector(".audio__time"),
  singer: document.querySelector(".audio__singer"),
  song: document.querySelector(".audio__song"),
  progress: document.querySelector(".audio__track_progress"),
  volume: document.querySelector(".audio__track_volume"),
  level: document.querySelector(".audio__volume_level"),
};

let audio;
let currentIndex = 0;
let isPlaying = false;
let isPrev = false;
let isNext = false;
let intervalId = null;
let currentTime = 0;

initializeAudioPlayer();

function initializeAudioPlayer() {
  audio = new Audio();

  load();

  controls.play.addEventListener("click", play);
  controls.play.addEventListener("touchend", play);
  controls.backward.addEventListener("click", playPrev);
  controls.forward.addEventListener("click", playNext);
  controls.track.addEventListener("input", seekTo);
  controls.volume.addEventListener("input", setVolume);
  audio.addEventListener("timeupdate", seekUpdate);
  audio.addEventListener("ended", () => {
    pause();
  });
}

function play() {
  if (isPlaying && !isPrev && !isNext) {
    return pause();
  }
  const current = songs[currentIndex];

  audio.src = `./assets/audio/${current.track}.mp3`;
  controls.singer.textContent = current.singer;
  controls.song.textContent = current.song;
  controls.cover.src = `./assets/covers/${current.cover}.jpg`;
  controls.background.firstElementChild.src = `./assets/covers/${current.cover}.jpg`;
  controls.progress.style.width = 0;

  if (currentTime) {
    audio.currentTime = currentTime;
  }
  audio.play();
  isPlaying = true;
  intervalId = setInterval(seekUpdate, 1000);

  controls.cover.style.transform = "scale(0.95)";
  controls.play.firstElementChild.style.transform = "scale(1)";
  controls.play.lastElementChild.style.transform =
    "translate(-50%, -50%) scale(0.2)";
  setTimeout(() => {
    controls.play.firstElementChild.classList.toggle("audio__icon_hidden");
    controls.play.lastElementChild.classList.toggle("audio__icon_hidden");
    controls.play.firstElementChild.style.transform = "scale(0.2)";
    controls.play.lastElementChild.style.transform =
      "translate(-50%, -50%) scale(1)";
  }, 0);
}

function pause() {
  audio.pause();
  isPlaying = false;
  controls.cover.style.transform = "scale(0.8)";
  controls.play.firstElementChild.style.transform = "scale(0.2)";
  controls.play.lastElementChild.style.transform =
    "translate(-50%, -50%) scale(1)";
  setTimeout(() => {
    controls.play.firstElementChild.classList.toggle("audio__icon_hidden");
    controls.play.lastElementChild.classList.toggle("audio__icon_hidden");
    controls.play.firstElementChild.style.transform = "scale(1)";
    controls.play.lastElementChild.style.transform =
      "translate(-50%, -50%) scale(0.2)";
  }, 0);
}

function playNext() {
  if (isPlaying) {
    pause();
  }
  isNext = true;
  currentIndex += 1;
  clearInterval(intervalId);
  currentTime = 0;
  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }
  play();
  isNext = false;
}

function playPrev() {
  if (isPlaying) {
    pause();
  }
  isPrev = true;
  currentIndex -= 1;
  clearInterval(intervalId);
  currentTime = 0;
  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }
  play();
  isPrev = false;
}

function seekTo(e) {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  const point = audio.duration * (controls.track.value / 100);

  // Set the current track position to the calculated seek position
  audio.currentTime = point;
  controls.progress.style.width = `${point}%`;
}

function seekUpdate() {
  let seekPosition = 0;
  currentTime = audio.currentTime;

  // Check if the current track duration is a legible number
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    controls.track.value = seekPosition;

    const progressPercent = (audio.currentTime / audio.duration) * 100;
    controls.progress.style.width = `${progressPercent}%`;

    // Calculate the time left and the total duration
    let startMinutes = Math.floor(audio.currentTime / 60);
    let startSeconds = Math.floor(audio.currentTime - startMinutes * 60);
    let endMinutes = Math.floor(audio.duration / 60);
    let endSeconds = Math.floor(audio.duration - endMinutes * 60);

    controls.time.firstElementChild.textContent = `${startMinutes}:${startSeconds
      .toFixed()
      .padStart(2, "0")}`;
    controls.time.lastElementChild.textContent = `${endMinutes}:${endSeconds
      .toFixed()
      .padStart(2, "0")}`;
  }
}

function setVolume() {
  // Set the volume according to the
  // percentage of the volume slider set
  const point = controls.volume.value / 100;
  audio.volume = point;
  controls.level.style.width = `${controls.volume.value}%`;
}

function load() {
  const current = songs[currentIndex];

  audio.src = `./assets/audio/${current.track}.mp3`;
  controls.singer.textContent = current.singer;
  controls.song.textContent = current.song;
  controls.cover.src = `./assets/covers/${current.cover}.jpg`;
  controls.background.firstElementChild.src = `./assets/covers/${current.cover}.jpg`;
  controls.progress.style.width = 0;

  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progressPercent = (currentTime / duration) * 100;
  controls.progress.style.width = `${progressPercent}%`;

  const point = controls.volume.value / 100;
  audio.volume = point;
  controls.level.style.width = `${controls.volume.value}%`;
}
