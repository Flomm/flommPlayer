import customAlert from '../Functions/alert.js';

export default function onKeyDown(ev, player) {
  if (!player.popUp) {
    try {
      if (!player.curTrack) {
        customAlert('First choose a song.', 'error');
      } else {
        switch (ev.code) {
          case 'Space':
            player.curTrack.playB.click();
            break;
          case 'KeyN':
            player.curTrack.forthB.click();
            break;
          case 'KeyP':
            player.curTrack.backB.click();
            break;
          case 'Escape':
            player.curTrack.vBtn.click();
            break;
        }
      }
    } catch (err) {
      alert(err);
    }
  }
}
