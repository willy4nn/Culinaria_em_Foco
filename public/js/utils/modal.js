function displayModal(message, callback) {
    const modal = document.createElement("div");
    const div = document.createElement('div');
    const buttonsdiv = document.createElement('div');
    
    const description = document.createElement('span');
    const buttonCancel = document.createElement('button');
    const buttonConfirm = document.createElement('button');
    
    modal.classList.add("modal");
    div.classList.add("modal-content");
    description.classList.add("modal-description");

    modal.style.display = 'flex';

    buttonCancel.innerText = 'Cancelar';
    buttonConfirm.innerText = 'Confirmar';
    description.innerText = message;
    
    buttonsdiv.append(buttonCancel, buttonConfirm);
    div.append(description,buttonsdiv);
    modal.appendChild(div);
    
    buttonConfirm.addEventListener("click", () => {
        callback(); 
        modal.style.display = "none";
    })
       
    buttonCancel.addEventListener("click", function (e) {
        modal.style.display = "none";
    });

    console.log("cb", callback);

    return modal;
}
export default displayModal;


