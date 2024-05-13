import createCustomEvent from "./eventModule.js";

export default function setNavigation(element, route) {
 element.addEventListener('click', () => {
   const event = createCustomEvent(`${route}`);
   window.dispatchEvent(event);
 });
}
