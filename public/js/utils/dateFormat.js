function dateFormat(date){
    const data = new Date(date);

    const addZero = (num) => (num < 10 ? '0' + num : num);

    const dia = addZero(data.getDate());
    const mes = addZero(data.getMonth() + 1);
    const ano = data.getFullYear();
    const horas = addZero(data.getHours());
    const minutos = addZero(data.getMinutes());
    const segundos = addZero(data.getSeconds());

    const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

    return(dataFormatada);
}

function dateFormatUS(date){
    const data = new Date(date);

    const addZero = (num) => (num < 10 ? '0' + num : num);

    const dia = addZero(data.getDate());
    const mes = addZero(data.getMonth() + 1);
    const ano = data.getFullYear();
    const horas = addZero(data.getHours());
    const minutos = addZero(data.getMinutes());
    const segundos = addZero(data.getSeconds());

    const dataFormatada = `${ano}/${mes}/${dia} ${horas}:${minutos}:${segundos}`;

    return(dataFormatada);
}

export { dateFormat, dateFormatUS };