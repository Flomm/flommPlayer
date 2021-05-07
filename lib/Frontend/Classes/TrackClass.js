import customAlert from '../Functions/alert.js';

export default class Track {
  data;
  li;
  num;
  onSelect;
  onSwitch;
  player;
  audio;
  isOn;
  isMuted;
  curTimeDiv;
  tSlider;
  playB;
  backB;
  forthB;
  shuffleB;
  vBtn;

  constructor(data, num, onSelect, onSwitch, onShuffle) {
    this.data = data;
    this.num = num;
    this.onSelect = onSelect;
    this.onSwitch = onSwitch;
    this.onShuffle = onShuffle;
    this.audio = new Audio(this.data.url);
    this.audio.volume = 0.5;
    this.isOn = false;
    this.isMuted = false;
    this.handleClick = this.handleClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleTimeSlide = this.handleTimeSlide.bind(this);
    this.removeSelf = this.removeSelf.bind(this);
    this.audio.addEventListener('timeupdate', (ev) => {
      this.handleTimeUpdate(Math.floor(ev.target.currentTime));
    });
    this.audio.addEventListener('ended', () => {
      this.playB.click();
    });
  }

  createAssets() {
    return new Promise((resolve) => {
      this.audio.onloadedmetadata = () => {
        this.buildLi();
        this.buildPlayer();
        resolve(true);
      };
    });
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

  handleClick() {
    this.onSelect(this);
  }

  handlePlayClick(ev) {
    if (!this.isOn) {
      ev.target.style.backgroundImage = `url('./lib/assets/img/pause.svg')`;
      this.isOn = true;
      this.audio.play();
    } else {
      ev.target.style.backgroundImage = `url('./lib/assets/img/play.svg')`;
      this.isOn = false;
      this.audio.pause();
    }
  }

  handleMute(ev) {
    if (!this.isMuted) {
      this.audio.muted = true;
      this.isMuted = true;
      ev.target.textContent = 'X';
    } else {
      this.audio.muted = false;
      this.isMuted = false;
      ev.target.textContent = '';
    }
  }

  handleVolume(val) {
    this.audio.volume = val / 100;
  }

  handleTimeUpdate(time) {
    this.curTimeDiv.textContent = this.calcMin(time);
    this.tSlider.value = (time / this.audio.duration) * 100;
  }

  handleTimeSlide(val) {
    if (this.audio.ended) this.playB.click();
    this.audio.currentTime = (this.audio.duration / 100) * val;
    this.curTimeDiv.textContent = this.calcMin(Math.floor(this.audio.currentTime));
  }

  buildPlayer() {
    this.player = document.createElement('div');
    this.player.classList.add('player');
    const controls = document.createElement('div');
    this.backB = document.createElement('button');
    this.backB.addEventListener('click', () => {
      this.onSwitch(false);
    });
    this.backB.classList.add('back');
    this.backB.style.backgroundImage = `url('/lib/assets/img/rewind.svg')`;
    this.playB = document.createElement('button');
    this.playB.classList.add('play');
    this.playB.style.backgroundImage = `url('./lib/assets/img/play.svg')`;
    this.playB.addEventListener('click', (ev) => {
      this.handlePlayClick(ev);
    });
    this.forthB = document.createElement('button');
    this.forthB.classList.add('forth');
    this.forthB.style.backgroundImage = `url('./lib/assets/img/forward.svg')`;
    this.forthB.addEventListener('click', () => {
      this.onSwitch(true);
    });
    controls.appendChild(this.backB);
    controls.appendChild(this.playB);
    controls.appendChild(this.forthB);
    this.player.appendChild(controls);
    const times = document.createElement('div');
    this.curTimeDiv = document.createElement('span');
    this.curTimeDiv.classList.add('current');
    this.curTimeDiv.textContent = '0:00';
    this.tSlider = document.createElement('input');
    this.tSlider.classList.add('t-slider');
    this.tSlider.type = 'range';
    this.tSlider.max = '100';
    this.tSlider.value = '0';
    this.tSlider.addEventListener('input', (ev) => {
      this.handleTimeSlide(parseInt(ev.target.value));
    });
    const fullSpan = document.createElement('span');
    fullSpan.classList.add('full');
    fullSpan.textContent = this.calcMin(parseInt(this.audio.duration));
    times.appendChild(this.curTimeDiv);
    times.appendChild(this.tSlider);
    times.appendChild(fullSpan);
    this.player.appendChild(times);
    this.shuffleB = document.createElement('button');
    this.shuffleB.classList.add('shuffle');
    this.shuffleB.style.backgroundImage = `url('./lib/assets/img/shuffle.svg')`;
    this.shuffleB.addEventListener('click', (ev) => {
      ev.target.classList.toggle('pulse');
      this.onShuffle();
    });
    this.player.appendChild(this.shuffleB);
    const vol = document.createElement('div');
    this.vBtn = document.createElement('button');
    this.vBtn.classList.add('volume');
    this.vBtn.style.backgroundImage = `url('./lib/assets/img/volume.svg')`;
    this.vBtn.addEventListener('click', (ev) => {
      this.handleMute(ev);
    });
    vol.appendChild(this.vBtn);
    const vSlider = document.createElement('input');
    vSlider.type = 'range';
    vSlider.max = '100';
    vSlider.value = '50';
    vSlider.classList.add('v-slider');
    vSlider.addEventListener('input', (ev) => {
      this.handleVolume(parseInt(ev.target.value));
    });
    vol.appendChild(vSlider);
    this.player.appendChild(vol);
  }

  buildLi() {
    this.li = document.createElement('li');
    const numSpan = document.createElement('span');
    numSpan.textContent = this.num;
    this.li.appendChild(numSpan);
    const bodyDiv = document.createElement('div');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = this.data.title;
    bodyDiv.appendChild(titleSpan);
    const durSpan = document.createElement('span');
    durSpan.textContent = this.calcMin(parseInt(this.audio.duration));
    bodyDiv.appendChild(durSpan);
    this.li.appendChild(bodyDiv);
    this.li.addEventListener('click', this.handleClick);
  }
}
