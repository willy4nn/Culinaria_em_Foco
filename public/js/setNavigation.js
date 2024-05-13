import createCustomEvent from "./eventModule.js";

let previousClickEvent = null;

export default function setNavigation(element, route) {
  // Remova o evento de clique anterior, se existir
  if (previousClickEvent) {
    element.removeEventListener('click', previousClickEvent);
  }

  // Crie um novo evento de clique
  function dispatchEvent() {
    const event = createCustomEvent(`${route}`);
    window.dispatchEvent(event);
  }

  // Adicione o novo evento de clique e atualize a referência
  element.addEventListener('click', dispatchEvent);
  previousClickEvent = dispatchEvent;
}
