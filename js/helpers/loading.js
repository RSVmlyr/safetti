const loadingData = (element) => {
    const loadingDiv = document.createElement('img');
    loadingDiv.src = '../img/icon/icon-spinner.gif';
    loadingDiv.classList.add('loading-message');
    
    return loadingDiv;
}

export default loadingData;