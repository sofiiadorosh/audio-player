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
};

const audio = new Audio();
let currentIndex = 0;
let isPlaying = false;
let isPrev = false;
let isNext = false;

load();

controls.play.addEventListener("click", play);
controls.backward.addEventListener("click", playPrev);
controls.forward.addEventListener("click", playNext);
audio.addEventListener("timeupdate", updateTrackProgress);

function play() {
  if (isPlaying && !isPrev && !isNext) {
    return pause();
  }
  const current = songs[currentIndex];

  audio.src = `./assets/audio/${current.track}.mp3`;
  controls.singer.textContent = current.singer;
  controls.song.textContent = current.song;
  controls.cover.src = `./assets/covers/${current.cover}.jpg`;
  controls.background.style.backgroundImage = `url('../assets/covers/${current.cover}.jpg')`;
  controls.track.style.width = 0;

  audio.play();
  isPlaying = true;

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
  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }
  play();
  isPrev = false;
}

function updateTrackProgress() {
  let intervalId = setInterval(() => {
    const currentTime = audio.currentTime ?? 0;
    const duration = audio.duration ?? 0;
    const progressPercent = (currentTime / duration) * 100;
    controls.track.style.width = `${progressPercent}%`;

    const remaining = duration - currentTime;
    const [sMinutes, sSeconds] = convertSecToMinSec(currentTime);
    controls.time.firstElementChild.textContent = `${sMinutes}:${sSeconds
      .toFixed()
      .padStart(2, "0")}`;
    const [eMinutes, eSeconds] = convertSecToMinSec(remaining);
    controls.time.lastElementChild.textContent = `-${eMinutes}:${eSeconds
      .toFixed()
      .padStart(2, "0")}`;

    if (currentTime >= duration) {
      play();
    } else if (currentTime >= duration) {
      pause();
      clearInterval(intervalId);
    }
  }, 1000);
}

function convertSecToMinSec(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return [minutes, remainingSeconds];
}

function load() {
  const current = songs[currentIndex];

  audio.src = `./assets/audio/${current.track}.mp3`;
  controls.singer.textContent = current.singer;
  controls.song.textContent = current.song;
  controls.cover.src = `./assets/covers/${current.cover}.jpg`;
  controls.background.style.backgroundImage = `url('../assets/covers/${current.cover}.jpg')`;
  controls.track.style.width = 0;

  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const progressPercent = (currentTime / duration) * 100;
  controls.track.style.width = `${progressPercent}%`;
}
