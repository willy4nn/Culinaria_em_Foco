// Importa os módulos necessários
import setNavigation from '../setNavigation.js';
import footer from './elements/footer.js'
import header from './elements/header.js'

// Função principal que renderiza a página inicial
export default function notFound() {
  // HTML do conteúdo da página inicial
  function createNotFoundContentHTML() {
    const homeContentHTML = `
    <main class="main main-home">
Não há nada por aqui...
Mas você pode acessar outros posts, por favor volte para a <a>Home</a>
    </main>
  `;
    return homeContentHTML;
  }

  // Cria um elemento div para a página inicial
  const notFoundElement = document.createElement('div');
  notFoundElement.classList.add('home-container');
  notFoundElement.innerHTML = createNotFoundContentHTML();

  const main = notFoundElement.querySelector("main") 
  const buttonHome = notFoundElement.querySelector("a")

  setNavigation(buttonHome, "/home")

  notFoundElement.insertBefore(header(), main)
  notFoundElement.append(footer())

  // Retorna o elemento da página inicial
  return notFoundElement;
}