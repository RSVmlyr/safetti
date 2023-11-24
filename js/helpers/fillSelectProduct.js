const fillSelectProduct = (nodeSelectId, arr) => {
  arr.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item;
    optionElement.textContent = item;
    nodeSelectId.appendChild(optionElement);
  });
}

export default fillSelectProduct