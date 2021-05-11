export default function customAlert(alertText, type) {
  const newAlert = document.createElement('div');
  newAlert.classList.add(`alert`);
  newAlert.classList.add(`${type}`);
  newAlert.textContent = alertText;
  document.body.appendChild(newAlert);
  setTimeout(() => {
    return newAlert.remove();
  }, 2000);
}
