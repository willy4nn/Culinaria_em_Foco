function displayModal(content, callback) {
    const modal = document.createElement("div");
    const div = document.createElement('div');
    const buttonsdiv = document.createElement('div');
    
    const description = document.createElement('span');
    const buttonCancel = document.createElement('button');
    const buttonConfirm = document.createElement('button');
    
    modal.classList.add("modal");
    div.classList.add("modal-content");
    description.classList.add("modal-description");
    buttonCancel.classList.add("modal-button");
    buttonConfirm.classList.add("modal-button");
    
    modal.style.display = 'flex';

    buttonCancel.innerText = 'Cancelar';
    buttonConfirm.innerText = 'Confirmar';
    //description.innerText = content;
    description.appendChild(content);
    
    buttonsdiv.append(buttonCancel, buttonConfirm);
    div.append(description,buttonsdiv);
    modal.appendChild(div);
    
    buttonConfirm.addEventListener("click", () => {
        callback(); 
        modal.style.display = "none";
        modal.remove();
    })
       
    buttonCancel.addEventListener("click", function (e) {
        modal.style.display = "none";
        modal.remove();
    });

    return modal;
}
export default displayModal;


