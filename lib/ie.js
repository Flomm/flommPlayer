const button = document.querySelector('button');
const div = document.querySelector('div');
const newDiv = document.createElement('div');
const text = '<h1>No, seriously. Go get a decent browser.</h1><h2>For your own sake.</h2><h2>Please.</h2>';
newDiv.innerHTML = text;

function changePage() {
  document.body.removeChild(div);
  document.body.appendChild(newDiv);
}

button.addEventListener('click', changePage);
