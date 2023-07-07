import nodeNotification from "../../helpers/nodeNotification.js";

const setQuotation = async dataSetQuotation => {
  try {
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
    // console.log(reqQueryS);
    
    if(reqQueryS.status === 200) {
      nodeNotification('Cotización Guardada...')
      setTimeout(() => {
        const quotationewBack = document.querySelector('#quotationew--back')
        quotationewBack.click()
      }, 1000);
    } else if (reqQueryS.status === 400) {
     nodeNotification('Valida que los campos estén correctos')
    } else if (reqQueryS.status == 500) {
      nodeNotification('Error 500, Error interno del servidor')
    }

    return resQueryS
    
  }
  
  catch(error) {
    console.log('No se pudo crear las cotizaciones', error);
    const quotationContentList = document.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default setQuotation