
const nodeList = (array, node) => {
  array.forEach(newNode => {
    const nodeP = document.createElement("p");
    nodeP.classList.add('quotation--text')
    nodeP.textContent = newNode;
    node.insertAdjacentElement('afterbegin', nodeP);
  });
}

export default nodeList