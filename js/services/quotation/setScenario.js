import nodeNotification from "../../helpers/nodeNotification.js";

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
    // console.log(reqQueryS);

    if(reqQueryS.status === 200) {
      nodeNotification('Escenario Guardado...')
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
  }
}

export default setScenario