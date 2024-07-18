scss/

sass --watch --style=compressed main.scss ../css/main.css

/// nueva cotizacion
let dataSetQuotation = {
  "currency": "COP",
  "name": "Nombre de la Cotización",
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

/// esenario 
"id": 19
"scenarios": [
    {
      "name": "testEscenarioTest 1",
      "selected": false,
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

// configuration local
export const config = {
    // baseUrl: "", //prod
    baseUrl: "https://safetticustom.azurewebsites.net",// local
    API_DEV_IMAGE: "https://dev-co-safetti-b2b.pantheonsite.io",// local
}