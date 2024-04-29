function animationClick(element) {
    element.classList.add('clicked');
    setTimeout(() => {
      element.classList.remove('clicked');
    }, 100);
}

export { animationClick };