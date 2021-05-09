import Player from './Frontend/Classes/PlayerClass.js';
import onKeyDown from './Frontend/Functions/globalOnKeyDown.js';
import toggleDarkMode from './Frontend/Functions/toggleDarkMode.js';

const root = document.documentElement;
const toggleStyle = document.querySelector('input[type="checkbox"]');

toggleStyle.addEventListener('change', (ev) => {
  toggleDarkMode(ev.target, root);
});

window.addEventListener('load', () => {
  const player = new Player();
  document.addEventListener('keydown', (ev) => {
    onKeyDown(ev, player);
  });
});
