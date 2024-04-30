function modalError() {
    const popupCard = document.createElement('div');
    const button = document.createElement('button')
    const buttonSpan = document.createElement('span')
    const div = document.createElement('div');
    const divSpan = document.createElement('span');
    const divContent = document.createElement('div');
    const title = document.createElement('h3');
    const text = document.createElement('p');

    popupCard.classList.add('popup-card');
    button.classList.add('material-symbols-outlined', 'popup-button');
    buttonSpan.classList.add('popup-close-icon');
    divSpan.classList.add('material-symbols-outlined', 'popup-icon');
    divContent.classList.add('popup-content');

    buttonSpan.innerText = 'close';
    divSpan.innerText = 'forum';
    title.innerText = 'Oops, algo inesperado aconteceu!';
    text.innerText = 'Por favor, tente novamente ou entre em contato com o suporte.';

    button.appendChild(buttonSpan);
    div.appendChild(divSpan);
    divContent.append(title, text);
    popupCard.append(button, div, divContent);

    button.addEventListener("click", (e) => {
        popupCard.style.transform = "translateY(100vh) translateX(-16px)";
    });

    function showPopup(errorText, errorTitle) {
        title.innerText = errorTitle || 'Erro!';
        text.innerText = errorText;

        popupCard.style.transform = "translateY(80vh) translateX(-16px)";
        setTimeout(() => {
          popupCard.style.transform = "translateY(100vh) translateX(-16px)";
        }, 4000);
    }

    return { popupCard, showPopup };
}

export { modalError };
