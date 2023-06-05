const deleteChilds = (parentNode) => {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

export default deleteChilds