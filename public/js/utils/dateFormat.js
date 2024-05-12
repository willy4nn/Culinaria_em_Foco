function dateFormat(date){
    const data = new Date(date);

    const addZero = (num) => (num < 10 ? '0' + num : num);

    const dia = addZero(data.getDate());
    const mes = addZero(data.getMonth() + 1);
    const ano = data.getFullYear();
    const horas = addZero(data.getHours());
    const minutos = addZero(data.getMinutes());
    const segundos = addZero(data.getSeconds());

    const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

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

    const dataFormatada = `${ano}/${mes}/${dia} ${horas}:${minutos}`;

    return(dataFormatada);
}

function renewDate(subscriptionDate) {
    const receivedDate = new Date(subscriptionDate);
    const currentDate = new Date('2024/12/17');
    const receivedDay = receivedDate.getDate().toString().padStart(2, '0');

    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear();

    let renewalMonth, renewalYear;

    if (receivedDay >= currentDay) {
        renewalMonth = currentMonth;
        renewalYear = currentYear;
    } else {
        renewalMonth = (parseInt(currentMonth) + 1).toString().padStart(2, '0');
        renewalYear = currentYear;

        if (renewalMonth > 12) {
            renewalMonth = '01'; // Reset the month to January
            renewalYear++;
        }
    }

  return `${receivedDay}/${renewalMonth}/${renewalYear}`;
}

export { dateFormat, dateFormatUS, renewDate };