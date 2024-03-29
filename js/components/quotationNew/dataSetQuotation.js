const dataSetQuotation = (resQueryUser) => {

  let dataSet = {
    "currency": resQueryUser.currency,
    "name": "strings",
    "comments": "strings",
    "client": resQueryUser.id,
    "clientName": resQueryUser.fullName,
    "advisor": resQueryUser.advisorId,
    "advisorName": resQueryUser.advisorName,
    "scenarios": [
      {
        "name": "Escenario 1",
        "selected": true,
        "discountPercent": resQueryUser.specialDiscount,
        "applyTaxIVA": true,
        "products": [
          {
            "product": 46,
            "productName": "SHORT BIO AQUA ZERO GCC - FAJÓN EN CINTURA CON BOLSILLOS",
            "selectedMoldeCode": "G50004",
            "quantity": 5,
            "unitPrice": 187000
          }
        ]
      }
    ]
  }

}

export default dataSetQuotation