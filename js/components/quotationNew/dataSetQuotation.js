const dataSetQuotation = (resQueryUser) => {

  console.log('Recibido user: ', resQueryUser.currency);

  let dataSet = {
    "currency": resQueryUser.currency,
    "name": "string",
    "comments": "string",
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

  console.log('Data Creada', dataSet);

}

export default dataSetQuotation