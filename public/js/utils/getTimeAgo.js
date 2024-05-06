// Função para obter o tempo desde a postagem
export default function getTimeAgo(postDate) {
    const currentDate = new Date();
    const postDateObj = new Date(postDate);
  
    const timeDifference = currentDate.getTime() - postDateObj.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `há ${days} ${(days === 1 ? 'dia' : 'dias')}`;
    else if (hours > 0) return `há ${hours} ${(hours === 1 ? 'hora' : 'horas')}`;
    else if (minutes > 0) return `${minutes} ${(minutes === 1 ? 'minuto' : 'minutos')}`;
    else return 'agora';
  }
  