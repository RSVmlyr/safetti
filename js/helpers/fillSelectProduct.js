const fillSelectProduct = (nodeSelectId, arr) => {
  arr.forEach((item) => {
    const optionElement = document.createElement('option');
    optionElement.value = item;
    optionElement.textContent = item;

    if (nodeSelectId.id != "qncuentos") {
        optionElement.hidden = true;
    }

    nodeSelectId.appendChild(optionElement);
  });
}

export default fillSelectProduct