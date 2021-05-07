import Player from './Frontend/Classes/PlayerClass.js';
import onKeyDown from './Frontend/Functions/globalOnKeyDown.js';

window.addEventListener('load', () => {
  const player = new Player();
  document.addEventListener('keydown', (ev) => {
    onKeyDown(ev, player);
  });
});
