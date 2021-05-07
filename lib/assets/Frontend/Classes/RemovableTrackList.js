import TrackList from './TrackListClass.js';
import customAlert from '../Functions/alert.js';

export default class RemovableTrackList extends TrackList {
  constructor(data, trackList, onTrackSelect, getTracks, onRemoval) {
    super(data, trackList, onTrackSelect, getTracks);
    this.onRemoval = onRemoval;
    this.removeSelf = this.removeSelf.bind(this);
  }

  async removeSelf() {
    try {
      const response = await fetch(`/api/tracklists/${this.data.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const respObj = await response.json();
        throw respObj.error;
      }
      customAlert(`Tracklist has been successfully deleted.`, 'success');
    } catch (err) {
      customAlert(err, 'error');
    }
  }

  addDelBtn() {
    const delBtn = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-times');
    delBtn.appendChild(icon);
    delBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.onRemoval(this);
    });
    this.li.appendChild(delBtn);
  }

  returnLi() {
    this.createLi();
    this.addDelBtn();
    return this.li;
  }
}
