
const nodeListPrice = (array, node) => {
  array.forEach(newNode => {
    const nodeP = document.createElement("p");
    nodeP.classList.add('quotation--info')
    nodeP.textContent = typeof newNode === 'string' ? newNode.toLocaleString() : '$ ' + newNode.toLocaleString();
    node.insertAdjacentElement('afterbegin', nodeP);
  });
}

export default nodeListPrice