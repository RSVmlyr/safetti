const onlyInputNumbers = (event) => {
    if(isNaN(event.key) && event.key !== 'Backspace' && event.key !== 'ArrowLeft'
        && event.key !== 'ArrowRight' && event.key !== 'Delete') {
        event.preventDefault();
    }
}

export default onlyInputNumbers;