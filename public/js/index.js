// Importando o módulo de roteamento
import router from './router.js';

// Criando um ouvinte para o evento customizado 'onstatechange'
window.addEventListener('onstatechange', function (event) {
  // Obtendo o caminho da página de destino do evento
  const newPath = event.detail.path;

  // Chamando o método getPage do objeto de rotas, para obter a estrutura da página
  const page = router.getPage(newPath);

  // Alterando o endereço do navegador com o método pushState do objeto history
  // Isso permite que o usuário navegue entre as páginas sem recarregar a página inteira
  history.pushState({}, '', newPath);

  // Renderizando o conteúdo da página na div "root"
  renderPage(page);
});

// Ouvinte para o evento popstate
window.addEventListener('popstate', function (event) {
  // Obtendo o caminho da página a partir do estado da história do navegador
  const newPath = document.location.pathname;

  let page;
  // Chamando o método getPage do objeto de rotas, para obter a estrutura da página
  if (newPath == '/index.html') {
    page = router.getPage('/');
  } else {
    page = router.getPage(newPath);
  }

  // Renderizando o conteúdo da página na div "root"
  renderPage(page);
});

// Função para renderizar o conteúdo da página na div "root"
function renderPage(page) {
  const rootDiv = document.getElementById('root');
  rootDiv.innerHTML = ''; // Limpa qualquer conteúdo anterior
  rootDiv.appendChild(page); // Adiciona a página renderizada na div "root"
}

// Renderizando a página inicial na div "root" ao carregar a aplicação
const rootDiv = document.getElementById('root');
rootDiv.innerHTML = ''; // Limpa qualquer conteúdo anterior
rootDiv.appendChild(router['/']()); // Adiciona a página inicial renderizada na div "root"