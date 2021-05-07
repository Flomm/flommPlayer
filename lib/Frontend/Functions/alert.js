export default function customAlert(alertText, type) {
  const newAlert = document.createElement('div');
  const body = document.querySelector('body');
  newAlert.classList.add(`alert`);
  newAlert.classList.add(`${type}`);
  newAlert.textContent = alertText;
  body.appendChild(newAlert);
  setTimeout(() => {
    return newAlert.remove();
  }, 1500);
}
