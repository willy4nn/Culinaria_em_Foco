export default function header() {
  const header = document.createElement('header');
  header.classList.add('header');

  // Container da logo
  const containerLogo = document.createElement('div');
  containerLogo.classList.add('logo');

  const img = document.createElement('img');
  img.src = './assets/images/croissant-logo.svg';
  img.alt = "Logo Chef's Corner";

  const span = document.createElement('span');
  span.textContent = "Chef's Corner";

  // Container dos botões
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const buttonSignIn = document.createElement('a');
  buttonSignIn.classList.add('button', 'button-line');
  buttonSignIn.textContent = 'Sign In';

  const buttonSignUp = document.createElement('a');
  buttonSignUp.classList.add('button', 'button-fill');
  buttonSignUp.textContent = 'Sign Up';

  containerLogo.appendChild(img);
  containerLogo.appendChild(span);

  buttons.appendChild(buttonSignIn);
  buttons.appendChild(buttonSignUp);

  header.appendChild(containerLogo);
  header.appendChild(buttons);
  return header;
}
