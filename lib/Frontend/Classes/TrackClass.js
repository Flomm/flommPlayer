import customAlert from '../Functions/alert.js';
import toggleDiscRotate from '../Functions/toggleDiscRotate.js';
import appendChildren from '../Functions/appendChildren.js';
import setAllAtributes from '../Functions/setAllAttributes.js';

export default class Track {
  data;
  li;
  onSelect;
  onSwitch;
  onVol;
  player;
  audio;
  isOn;
  curTimeDiv;
  tSlider;
  playB;
  backB;
  forthB;
  shuffleB;
  vBtn;
  vSlider;

  constructor(data, onSelect, onSwitch, onShuffle, onVol) {
    this.data = data;
    this.onSelect = onSelect;
    this.onSwitch = onSwitch;
    this.onShuffle = onShuffle;
    this.onVol = onVol;
    this.audio = new Audio(this.data.url);
    this.isOn = false;
    this.buildPlayer();
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleTimeSlide = this.handleTimeSlide.bind(this);
    this.removeSelf = this.removeSelf.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.audio.addEventListener('timeupdate', (ev) => {
      this.handleTimeUpdate(Math.floor(ev.target.currentTime));
    });
    this.audio.addEventListener('ended', () => {
      this.playB.click();
    });
  }

  setVolume(vol) {
    this.audio.volume = vol;
    this.vSlider.value = vol * 10;
  }

  async removeSelf() {
    try {
      if (!this.audio.paused && !this.audio.ended) {
        this.playB.click();
      }
      const response = await fetch(`/api/tracks/${this.data.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const respObj = await response.json();
        throw respObj.error;
      }
      customAlert(`Track has been successfully deleted.`, 'success');
    } catch (err) {
      customAlert(err, 'error');
    }
  }

  calcMin(seconds) {
    if (seconds % 60 === 0) {
      return `${seconds / 60}:00`;
    } else if (seconds > 60) {
      const mins = Math.floor(seconds / 60);
      let secs = 0;
      if (seconds % 60 < 10) {
        secs = (seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
      } else {
        secs = seconds % 60;
      }
      return `${mins}:${secs}`;
    } else if (seconds < 10) {
      return `0:0${seconds}`;
    } else {
      return `0:${seconds}`;
    }
  }

  handlePlayClick(ev) {
    if (!this.isOn) {
      ev.target.style.backgroundImage = `url('./lib/assets/img/icons/pause.svg')`;
      this.isOn = true;
      this.audio.play();
    } else {
      ev.target.style.backgroundImage = `url('./lib/assets/img/icons/play.svg')`;
      this.isOn = false;
      this.audio.pause();
    }
    toggleDiscRotate();
  }

  handleMute(ev) {
    if (!this.audio.muted) {
      this.audio.muted = true;
      ev.target.textContent = 'X';
    } else {
      this.audio.muted = false;
      ev.target.textContent = '';
    }
  }

  handleTimeUpdate(time) {
    this.curTimeDiv.textContent = this.calcMin(time);
    this.tSlider.value = (time / this.audio.duration) * 100;
    this.tSlider.style.setProperty('--webkitProgressPercent', `${this.tSlider.value}%`);
  }

  handleTimeSlide(val) {
    if (this.audio.ended) this.playB.click();
    this.audio.currentTime = (this.audio.duration / 100) * val;
    this.curTimeDiv.textContent = this.calcMin(Math.floor(this.audio.currentTime));
  }

  handleVolumeChange(val) {
    this.onVol(val);
    this.vSlider.style.setProperty('--webkitProgressPercent', `${val}%`);
    this.audio.volume = val / 100;
  }

  buildPlayer() {
    this.player = document.createElement('div');
    this.player.classList.add('player');
    const controls = document.createElement('div');
    this.backB = document.createElement('button');
    this.backB.addEventListener('click', () => {
      this.onSwitch(false);
    });
    this.backB.style.backgroundImage = `url('/lib/assets/img/icons/rewind.svg')`;
    this.playB = document.createElement('button');
    this.playB.classList.add('play');
    this.playB.style.backgroundImage = `url('./lib/assets/img/icons/play.svg')`;
    this.playB.addEventListener('click', (ev) => {
      this.handlePlayClick(ev);
    });
    this.forthB = document.createElement('button');
    this.forthB.style.backgroundImage = `url('./lib/assets/img/icons/forward.svg')`;
    this.forthB.addEventListener('click', () => {
      this.onSwitch(true);
    });
    appendChildren(controls, [this.backB, this.playB, this.forthB]);
    this.player.appendChild(controls);
    const times = document.createElement('div');
    this.curTimeDiv = document.createElement('span');
    this.curTimeDiv.textContent = '0:00';
    this.tSlider = document.createElement('input');
    setAllAtributes(this.tSlider, ['type', 'max', 'value'], ['range', '100', '0']);
    this.tSlider.classList.add('t-slider');
    this.tSlider.addEventListener('input', (ev) => {
      ev.target.style.setProperty('--webkitProgressPercent', `${ev.target.value}%`);
      this.handleTimeSlide(parseInt(ev.target.value));
    });
    const fullSpan = document.createElement('span');
    fullSpan.textContent = this.calcMin(parseInt(this.data.duration));
    appendChildren(times, [this.curTimeDiv, this.tSlider, fullSpan]);
    this.shuffleB = document.createElement('button');
    this.shuffleB.classList.add('shuffle');
    this.shuffleB.style.backgroundImage = `url('./lib/assets/img/icons/shuffle.svg')`;
    this.shuffleB.addEventListener('click', (ev) => {
      ev.target.classList.toggle('pulse');
      this.onShuffle();
    });
    const vol = document.createElement('div');
    this.vBtn = document.createElement('button');
    this.vBtn.classList.add('volume');
    this.vBtn.style.backgroundImage = `url('./lib/assets/img/icons/volume.svg')`;
    this.vBtn.addEventListener('click', (ev) => {
      this.handleMute(ev);
    });
    this.vSlider = document.createElement('input');
    setAllAtributes(this.vSlider, ['type', 'max', 'value'], ['range', '100', '50']);
    this.vSlider.classList.add('v-slider');
    this.vSlider.addEventListener('input', (ev) => {
      this.handleVolumeChange(parseInt(ev.target.value));
    });
    appendChildren(vol, [this.vBtn, this.vSlider]);
    appendChildren(this.player, [controls, times, this.shuffleB, vol]);
  }

  buildLi(num) {
    this.li = document.createElement('li');
    const numSpan = document.createElement('span');
    numSpan.textContent = num;
    const bodyDiv = document.createElement('div');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = this.data.title;
    const durSpan = document.createElement('span');
    durSpan.textContent = this.calcMin(parseInt(this.data.duration));
    appendChildren(bodyDiv, [titleSpan, durSpan]);
    appendChildren(this.li, [numSpan, bodyDiv]);
    this.li.addEventListener('click', () => {
      this.onSelect(this);
    });
    return this.li;
  }
}
