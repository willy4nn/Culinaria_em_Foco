export default function footer() {
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  
  const paragraph = document.createElement('p');
  paragraph.classList.add('paragraph-medium');
  paragraph.textContent =
    '© 2024 Culinária em Foco. Todos os direitos reservados.';

  footer.appendChild(paragraph);

  return footer;
}
