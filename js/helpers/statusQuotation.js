// Status quotation

const statusQuotation = (id, node) => {
  if (id === 1) {
    node ? node.classList.add('quotation--status--requested') : node.classList.add('quotation--status--none')  
  } else if (id === 2) {
    node ? node.classList.add('quotation--status--confirmed') : node.classList.add('quotation--status--none')
  } else if (id === 3) {
    node ? node.classList.add('quotation--status--cancelled') : node.classList.add('quotation--status--none')
  } else if (id === 4) {
    node ? node.classList.add('quotation--status--toconfirm') : node.classList.add('quotation--status--none')
  }
}

export default statusQuotation

// Status quotation