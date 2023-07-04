const setScenario = async dataSetScenario => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSetScenario)
    };
    const urlQueryS = 'https://safetticustom.azurewebsites.net/api/Scenario'
    const reqQueryS = await fetch(urlQueryS, requestOptions)
    const resQueryS = await reqQueryS.json()
    console.log(reqQueryS);

    // if (reqQueryS.status == 200) {
    //   const quotationewBack = document.querySelector('#quotationew--back')
    //   quotationewBack.click()
    // }
    
    if (reqQueryS.status == 403) {
      console.log('Error 403');
    } else if (reqQueryS.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryS
    
  }
  
  catch(error) {
    console.log('No se pudo crear las cotizaciones', error);
    const quotationContentList = document.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default setScenario