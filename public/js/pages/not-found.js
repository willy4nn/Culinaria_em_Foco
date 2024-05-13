// Importa os módulos necessários
import setNavigation from '../setNavigation.js';
import footer from './elements/footer.js'
import header from './elements/header.js'

// Função principal que renderiza a página inicial
export default function notFound() {
  // HTML do conteúdo da página inicial
  function notFoundContentHTML() {
    const html = `
    <main class="main">
      <h1 class="secondary-heading">Página não encontrada<h1>
      <p class="paragraph-bold">
        Não há nada por aqui...
      </p>
    </main>
  `;
    return html;
  }

  // Cria um elemento div para a página inicial
  const notFoundElement = document.createElement('div');
  notFoundElement.classList.add('not-found-container');
  notFoundElement.innerHTML = notFoundContentHTML();

  const main = notFoundElement.querySelector("main");
  notFoundElement.insertBefore(header(), main)
  notFoundElement.append(footer())

  // Retorna o elemento da página inicial
  return notFoundElement;
}