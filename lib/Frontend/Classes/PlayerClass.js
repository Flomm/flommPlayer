import RemovableTrackList from './RemovableTrackList.js';
import TrackList from './TrackListClass.js';
import Track from './TrackClass.js';
import PopUp from './PopUpClass.js';
import customAlert from '../Functions/alert.js';

export default class Player {
  tracklists;
  leftList;
  rightList;
  curTrackList;
  curTrack;
  curTitle;
  curBand;
  picHolder;
  playerDiv;
  addTlBtn;
  addTrackBtn;
  addToFavBtn;
  delTrackBtn;
  popUp;
  favCheckList;
  volume;

  constructor() {
    this.tracklists = [];
    this.getFavs();
    this.leftList = document.querySelector('.left > ul');
    this.rightList = document.querySelector('.right > ul');
    this.curTitle = document.querySelector('.title').querySelector('h3');
    this.curBand = document.querySelector('.title').querySelector('span');
    this.picHolder = document.querySelector('.cover');
    this.addTlBtn = document.querySelector('.add-tl');
    this.addTrackBtn = document.querySelector('.add-song');
    this.addToFavBtn = document.querySelector('.add-fav');
    this.delTrackBtn = document.querySelector('.del-song');
    this.playerDiv = document.querySelector('.player-holder');
    this.popUp = null;
    this.volumeLevel = 50;
    this.handleTrackSelect = this.handleTrackSelect.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.handleTLPopUp = this.handleTLPopUp.bind(this);
    this.handleTLSubmit = this.handleTLSubmit.bind(this);
    this.handlePopUpClose = this.handlePopUpClose.bind(this);
    this.createOptions = this.createOptions.bind(this);
    this.handleTrackPopup = this.handleTrackPopup.bind(this);
    this.handleTrackSubmit = this.handleTrackSubmit.bind(this);
    this.handleTLDelete = this.handleTLDelete.bind(this);
    this.handleTrackDelete = this.handleTrackDelete.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.addTlBtn.addEventListener('click', this.handleTLPopUp);
    this.addTrackBtn.addEventListener('click', this.handleTrackPopup);
    this.addToFavBtn.addEventListener('click', () => {
      if (this.curTrack) {
        this.handleTrackSubmit(true);
      } else {
        customAlert('First choose a song.', 'error');
      }
    });
    this.delTrackBtn.addEventListener('click', () => {
      if (this.curTrack) {
        if (this.curTrackList.data.id === 1) {
          customAlert('You cannot delete from the All tracks playlist.', 'error');
        } else {
          this.handleTrackDelete();
        }
      } else {
        customAlert('First choose a song.', 'error');
      }
    });
    this.fetchTracklists();
  }

  setVolume(vol) {
    this.volumeLevel = vol;
  }

  handleTLPopUp() {
    if (this.popUp === null) {
      this.popUp = new PopUp('tl', this.handleTLSubmit, this.handlePopUpClose, null);
    }
  }

  handleTrackDelete() {
    this.playerDiv.innerHTML = '';
    this.setTitle('', '');
    this.setCover('./lib/assets/img/covers/music-placeholder.png');
    this.curTrack.removeSelf();
    this.addToFavBtn.classList.remove('fav');
    this.addToFavBtn.disabled = false;
    this.curTrackList.tracks.splice(this.curTrackList.tracks.indexOf(this.curTrack), 1);
    this.rightList.removeChild(this.curTrack.li);
    if (this.curTrackList.data.id === 2) {
      this.favCheckList.splice(this.favCheckList.indexOf(this.curTrack.data.mother_id), 1);
    }
    this.curTrack = null;
  }

  handleTLDelete(tracklist) {
    if (this.curTrackList) {
      if (tracklist.data.id === this.curTrackList.data.id) {
        this.rightList.innerHTML = '';
        this.playerDiv.innerHTML = '';
        this.setTitle('', '');
        this.setCover('./lib/assets/img/covers/music-placeholder.png');
        this.curTrackList = null;
        this.addToFavBtn.classList.remove('fav');
        this.addToFavBtn.disabled = false;
      }
    }
    tracklist.removeSelf();
    this.tracklists.splice(this.tracklists.indexOf(tracklist), 1);
    this.leftList.removeChild(tracklist.li);
  }

  async handleTLSubmit() {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: this.popUp.form.elements[0].value }),
      };
      const response = await fetch('/api/tracklists', options);
      const parsed = await response.json();
      if (!response.ok) {
        throw parsed.error;
      }
      const newTl = new RemovableTrackList(
        parsed,
        this.rightList,
        this.handleTrackSelect,
        this.getTracks,
        this.handleTLDelete
      );
      this.tracklists.push(newTl);
      this.leftList.appendChild(newTl.returnLi());
      this.leftList.scrollTop = this.leftList.scrollHeight;
      customAlert(`Playlist '${newTl.data.title}' has been successfully added.`, 'success');
    } catch (err) {
      customAlert(err, 'error');
    } finally {
      this.popUp = null;
    }
  }

  async handleTrackSubmit(fav) {
    try {
      let list_id;
      if (fav) {
        list_id = 2;
      } else {
        const selected = this.popUp.form.elements[0];
        list_id = selected.value;
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: this.curTrack.data.url,
          list_id: list_id,
          pic_url: this.curTrack.data.pic_url,
          mother_id: this.curTrack.data.mother_id,
        }),
      };
      const response = await fetch('/api/tracks', options);
      if (!response.ok) {
        const parsed = await response.json();
        throw parsed.error;
      }
      if (fav) {
        this.addToFavBtn.classList.add('fav');
        this.addToFavBtn.disabled = true;
        this.favCheckList.push(this.curTrack.data.mother_id);
        customAlert(`Track has been successfully added to the favourites.`, 'success');
      } else {
        customAlert(`Track has been successfully added to the selected playlist.`, 'success');
      }
    } catch (err) {
      customAlert(err, 'error');
    } finally {
      this.popUp = null;
    }
  }

  handleTrackPopup() {
    if (this.curTrack) {
      this.popUp = new PopUp('', this.handleTrackSubmit, this.handlePopUpClose, this.createOptions);
    } else {
      customAlert('First choose a song.', 'error');
    }
  }

  handlePopUpClose() {
    this.popUp = null;
  }

  async fetchTracklists() {
    try {
      const response = await fetch('/api/tracklists');
      const parsed = await response.json();
      if (!response.ok) {
        throw parsed.error;
      }
      parsed.forEach((tl) => {
        let newTL;
        if (tl.is_perm) {
          newTL = new TrackList(tl, this.rightList, this.handleTrackSelect, this.getTracks);
        } else {
          newTL = new RemovableTrackList(
            tl,
            this.rightList,
            this.handleTrackSelect,
            this.getTracks,
            this.handleTLDelete
          );
        }
        this.tracklists.push(newTL);
        this.leftList.appendChild(newTL.returnLi());
      });
    } catch (err) {
      this.addErrArt(this.leftList, err);
    }
  }

  async getFavs() {
    try {
      const response = await fetch(`/api/favs`);
      const parsed = await response.json();
      if (!response.ok) {
        throw parsed.error;
      }
      this.favCheckList = parsed.map((fav) => fav.mother_id);
    } catch (err) {
      customAlert('Favourites button will probably not work properly.');
    }
  }

  isFavs(track) {
    for (let fav of this.favCheckList) {
      if (fav === track.data.mother_id) return true;
    }
    return false;
  }

  async getTracks(tracklist) {
    if (this.curTrackList) {
      if (this.curTrackList.data.id === tracklist.data.id) {
        return;
      }
      if (this.curTrack) {
        this.curTrack.audio.pause();
        this.playerDiv.innerHTML = '';
        this.curTrack = null;
      }
      this.curTrackList.curTrack = null;
      this.curTrackList.li.classList.toggle('selected');
      if (this.curTrackList.isShuffle) this.curTrackList.handleShuffle();
    }
    try {
      this.addToFavBtn.classList.remove('fav');
      this.addToFavBtn.disabled = false;
      this.curTrackList = tracklist;
      this.curTrackList.li.classList.toggle('selected');
      this.setTitle('', '');
      this.setCover('./lib/assets/img/covers/music-placeholder.png');
      const response = await fetch(`/api/tracks/${this.curTrackList.data.id}`);
      const parsed = await response.json();
      this.curTrackList.trackListUL.innerHTML = '';
      if (!response.ok) {
        throw parsed.error;
      }
      this.curTrackList.tracks = [];
      parsed.forEach((track, i) => {
        const newTrack = new Track(
          track,
          this.curTrackList.onTrackSelect,
          this.curTrackList.handleButtonSwitch,
          this.curTrackList.handleShuffle,
          this.setVolume
        );
        this.curTrackList.tracks.push(newTrack);
        newTrack.buildLi(i + 1);
        this.curTrackList.trackListUL.appendChild(newTrack.li);
      });
    } catch (err) {
      this.addErrArt(this.rightList, err);
    }
  }

  createOptions() {
    let optionString = [];
    this.tracklists.forEach((tl) => {
      if (tl instanceof RemovableTrackList) {
        const newOpt = `<option value="${tl.data.id}">${tl.data.title}</option>`;
        optionString.push(newOpt);
      }
    });
    return optionString.join('');
  }

  addErrArt(list, err) {
    const errArt = document.createElement('article');
    errArt.textContent = err;
    list.appendChild(errArt);
  }

  toggleFavBtn() {
    if (this.isFavs(this.curTrack)) {
      if (!this.addToFavBtn.classList.contains('fav')) {
        this.addToFavBtn.classList.add('fav');
        this.addToFavBtn.disabled = true;
      }
    } else {
      if (this.addToFavBtn.classList.contains('fav')) {
        this.addToFavBtn.classList.remove('fav');
        this.addToFavBtn.disabled = false;
      }
    }
  }

  handleTrackSelect(track) {
    if (this.curTrack) {
      if (track.data.id === this.curTrack.data.id) {
        return;
      }
      this.curTrack.handleTimeUpdate(0);
      this.curTrack.audio.currentTime = 0;
      if (!this.curTrack.audio.paused && !this.curTrack.audio.ended) {
        this.curTrack.playB.click();
      }
      this.curTrack.li.classList.toggle('selected');
    }
    this.curTrack = track;
    this.curTrack.vSlider.value = this.volumeLevel;
    this.curTrack.handleVolumeChange(this.volumeLevel);
    this.curTrackList.curTrack = this.curTrack;
    this.curTrack.li.classList.toggle('selected');
    this.toggleFavBtn();
    if (this.curTrack.data.pic_url) {
      this.setCover(this.curTrack.data.pic_url);
    } else {
      this.setCover('./lib/assets/img/covers/music-placeholder.png');
    }
    this.setTitle(this.curTrack.data.title, this.curTrack.data.band);
    this.playerDiv.innerHTML = '';
    this.playerDiv.appendChild(this.curTrack.player);
  }

  setCover(url) {
    this.picHolder.style.backgroundImage = `url('${url}')`;
  }

  setTitle(title, band) {
    this.curTitle.textContent = title;
    this.curBand.textContent = band;
  }
}
