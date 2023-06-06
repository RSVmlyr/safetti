const fillSelect = (nodeSelectId, arr) => {
  // Order
  arr.sort((a, b) => a.fullName.localeCompare(b.fullName));
  // Order

  arr.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item.fullName;
    optionElement.textContent = item.fullName;
    nodeSelectId.appendChild(optionElement);
  });
}

export default fillSelect