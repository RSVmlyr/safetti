const fillSelectProduct = (nodeSelectId, arr) => {
  // Order
  // arr.sort((a, b) => a.fullName.localeCompare(b.fullName));
  // Order

  arr.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item;
    optionElement.textContent = item;
    nodeSelectId.appendChild(optionElement);
  });
}

export default fillSelectProduct