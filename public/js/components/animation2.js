function loading(div) {
    const loading = document.createElement('img');
    loading.src = '/assets/images/loading-icon.gif';
    loading.classList.add('loading-icon'); 
  
    div.appendChild(loading);
}

function loaderr() {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    return loader;
}

function getTimeAgo(postDate) {
    const currentDate = new Date();
    const postDateObj = new Date(postDate);
  
    const timeDifference = currentDate.getTime() - postDateObj.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return days + (days === 1 ? ' day ago' : ' days ago');
    else if (hours > 0) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    else if (minutes > 0) return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
    else return 'Just now';
}

export { loading, loaderr, getTimeAgo };