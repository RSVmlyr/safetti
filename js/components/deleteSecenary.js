const deleteScenary = (eventNode, deleteNode) => {
  eventNode.addEventListener('click', () => {
    deleteNode.remove()
  })
}

export default deleteScenary