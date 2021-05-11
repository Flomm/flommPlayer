export default class TrackList {
  data;
  li;
  tracks;
  trackListUL;
  onTrackSelect;
  getTracks;
  curTrack;
  isShuffle;

  constructor(data, trackListUL, onTrackSelect, getTracks) {
    this.data = data;
    this.trackListUL = trackListUL;
    this.getTracks = getTracks;
    this.curTrack = null;
    this.isShuffle = false;
    this.onTrackSelect = onTrackSelect;
    this.handleButtonSwitch = this.handleButtonSwitch.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.clickRandom = this.clickRandom.bind(this);
  }

  handleShuffle() {
    if (!this.isShuffle) {
      this.isShuffle = true;
      this.tracks.forEach((track) => {
        track.audio.addEventListener('ended', this.clickRandom);
      });
      if (this.curTrack.audio.ended) {
        this.clickRandom();
      }
      if (this.curTrack.audio.paused) this.curTrack.playB.click();
      return;
    }
    this.isShuffle = false;
    this.tracks.forEach((track) => {
      track.audio.removeEventListener('ended', this.clickRandom);
    });
  }

  async clickRandom() {
    const randomNum = Math.floor(Math.random() * this.tracks.length);
    await this.tracks[randomNum].li.click();
    this.curTrack.shuffleB.classList.toggle('pulse');
    this.curTrack.playB.click();
  }

  handleButtonSwitch(dir) {
    const i = this.tracks.indexOf(this.curTrack);
    dir ? this.switchForward(i) : this.switchBack(i);
  }

  switchForward(i) {
    if (i === this.tracks.length - 1) {
      return this.tracks[0].li.click();
    }
    return this.tracks[i + 1].li.click();
  }

  switchBack(i) {
    if (i === 0) {
      return this.tracks[this.tracks.length - 1].li.click();
    }
    return this.tracks[i - 1].li.click();
  }

  createLi() {
    this.li = document.createElement('li');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = this.data.title;
    this.li.appendChild(titleSpan);
    this.li.addEventListener('click', () => {
      this.getTracks(this);
    });
  }

  returnLi() {
    this.createLi();
    return this.li;
  }
}
