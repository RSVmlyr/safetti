// Status quotation

const liteStatusQuotation = (id) => {
  if (id === 1) {
   return('quotation--status--requested')  
  } else if (id === 2) {
   return('quotation--status--confirmed')
  } else if (id === 3) {
   return('quotation--status--cancelled')
  }  else if (id === 4) {
    return('quotation--status--toconfirm')
  }  else if (id === 5) {
    return('quotation--status--validateadvance')
  } else {
    return('quotation--status--none')
  }
}

export default liteStatusQuotation

// Status quotation