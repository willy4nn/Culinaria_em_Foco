import createCustomEvent from "./eventModule.js";

export default function setNavigation(element, route) {
 element.addEventListener('click', () => {
   // Dispara um evento personalizado de login
   const event = createCustomEvent(`${route}`);
   window.dispatchEvent(event);
 });
}
