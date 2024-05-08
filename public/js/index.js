import router from './router.js';

// Função para renderizar o conteúdo da página na div "root"
function renderPage(page) {
  const rootDiv = document.getElementById('root');
  rootDiv.innerHTML = ''; // Limpa qualquer conteúdo anterior
  page.classList.add('append-div');
  rootDiv.appendChild(page); // Adiciona a página renderizada na div "root"
}

// Ouvinte para o evento customizado 'onstatechange'
window.addEventListener('onstatechange', function (event) {
  const newPath = event.detail.path;
  const page = router.getPage(newPath);
  history.pushState({}, '', newPath);
  renderPage(page);
});

// Ouvinte para o evento popstate
window.addEventListener('popstate', function () {
  const newPath = document.location.pathname;
  const page = router.getPage(newPath);
  renderPage(page);
});

// Obtém o caminho da página atual e renderiza a página correspondente
const initialPath = document.location.pathname;
const initialPage = router.getPage(initialPath);
renderPage(initialPage);