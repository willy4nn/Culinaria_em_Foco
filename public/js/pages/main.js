import createCustomEvent from '../eventModule.js';

export default function main() {
  // Container principal
  const mainPageElement = document.createElement('div');
  mainPageElement.classList.add('initial-main');

  // Container de texto
  const textContainer = document.createElement('div');
  textContainer.classList.add('main-content-text');

  // Título
  const title = document.createElement('h1');
  title.textContent = 'Arouse your palate to new culinary experiences.';
  title.classList.add('title');

  // Parágrafo
  const paragraph = document.createElement('p');
  paragraph.classList.add('paragraph');
  paragraph.textContent =
    'Discover unique flavors and culinary inspirations in our featured digital magazine. Creative recipes, chef tips, and stories that will transform your kitchen into a true stage of delights. Explore with us the world of gastronomy!';

  // Container de botões
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const buttonSignIn = document.createElement('a');
  buttonSignIn.textContent = 'Sign In';
  buttonSignIn.classList.add('button', 'button-line');
  buttonSignIn.addEventListener('click', () => {
    const event = createCustomEvent('/login');
    window.dispatchEvent(event);
  });

  const buttonSignUp = document.createElement('a');
  buttonSignUp.textContent = 'Sign Up';
  buttonSignUp.href = '#';
  buttonSignUp.classList.add('button', 'button-fill');

  // Container da imagem
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('main-content-image');

  // Imagem
  const img = document.createElement('img');
  img.src = './assets/images/initial-main-image.jpg';

  buttons.appendChild(buttonSignIn);
  buttons.appendChild(buttonSignUp);

  textContainer.appendChild(title);
  textContainer.appendChild(paragraph);
  textContainer.appendChild(buttons);

  imageContainer.appendChild(img);

  mainPageElement.appendChild(textContainer);
  mainPageElement.appendChild(imageContainer);

  return mainPageElement;
}
