export default class PopUp {
  window;
  form;
  okBtn;
  cancelBtn;
  type;
  onSubmit;
  onClose;

  constructor(formType, onSubmit, onClose, onOptions) {
    this.type = formType;
    this.onSubmit = onSubmit;
    this.removeWindow = this.removeWindow.bind(this);
    this.onClose = onClose;
    this.onOptions = onOptions;
    this.buildWindow();
    this.showWindow();
  }

  showWindow() {
    document.querySelector('.wrapper').classList.add('disabled');
    document.querySelector('body').appendChild(this.window);
  }

  removeWindow() {
    document.querySelector('.wrapper').classList.remove('disabled');
    document.querySelector('body').removeChild(this.window);
    this.onClose();
  }

  buildWindow() {
    this.window = document.createElement('div');
    this.window.classList.add('pop-up');
    this.form = document.createElement('form');
    this.form.id = 'tlForm';
    const label = document.createElement('label');
    let input;
    if (this.type === 'tl') {
      label.textContent = 'Please add the name of the new tracklist.';
      input = document.createElement('input');
      input.type = 'text';
      input.minLength = '5';
      input.maxLength = '25';
      input.required = true;
    } else {
      label.textContent = 'Please choose a tracklist.';
      input = document.createElement('select');
      input.innerHTML += this.onOptions();
    }
    this.form.appendChild(label);
    this.form.appendChild(input);
    this.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      this.onSubmit();
      this.removeWindow();
    });
    const buttonHolder = document.createElement('div');
    this.okBtn = document.createElement('button');
    this.okBtn.textContent = 'OK';
    this.okBtn.setAttribute('form', 'tlForm');
    this.cancelBtn = document.createElement('button');
    this.cancelBtn.textContent = 'Close';
    this.cancelBtn.addEventListener('click', this.removeWindow);
    buttonHolder.appendChild(this.okBtn);
    buttonHolder.appendChild(this.cancelBtn);
    this.window.appendChild(this.form);
    this.window.appendChild(buttonHolder);
  }
}
