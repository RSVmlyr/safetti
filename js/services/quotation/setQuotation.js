const setQuotation = async () => {
  try {
    let dataSetQuotation = {
      "currency": "COP",
      "name": "Renata Novais",
      "comments": "string",
      "client": 19,
      "clientName": "Renata Novais",
      "advisor": 4,
      "advisorName": "Alejandro Ramírez",
      "scenarios": [
        {
          "name": "testEscenarioTest 1",
          "selected": true,
          "discountPercent": 10,
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
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSetQuotation)
    };
    const urlQueryS = 'https://safetticustom.azurewebsites.net/api/Quotation'
    const reqQueryS = await fetch(urlQueryS, requestOptions)
    const resQueryS = await reqQueryS.json()
    console.log(reqQueryS);
    
    if (reqQueryS.status == 403) {
      console.log('Error 403');
    } else if (reqQueryS.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryS
    
  }
  
  catch(error) {
    console.log('No se pudo traer las cotizaciones', error);
    const quotationContentList = document.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default setQuotation