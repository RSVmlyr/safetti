const inputNumber = (inputSelector, increase, decrease) => {
  const increaseButton = document.querySelector(increase);
  const decreaseButton = document.querySelector(decrease);

  increaseButton.addEventListener('click', () => {
    inputSelector.stepUp();
  });

  decreaseButton.addEventListener('click', () => {
    if (inputSelector.value > 0) {
      inputSelector.stepDown();
    }
  });

}

export default inputNumber
