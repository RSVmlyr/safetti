import nodeNotification from "../../helpers/nodeNotification.js";
import ExpiringLocalStorage from '../../components/localStore/ExpiringLocalStorage.js';
import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;

const putScenario = async (dataSetScenario, cotId) => {
  try {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataSetScenario)
    };
    const urlQueryS = `${API_DEV}/api/Scenario`
    const reqQueryS = await fetch(urlQueryS, requestOptions)
    const resQueryS = await reqQueryS.json()

    if(reqQueryS.status === 200) {
      nodeNotification('Guardando escenario...')
      const expiringLocalStorage = new ExpiringLocalStorage()
      expiringLocalStorage.deleteDataWithExpiration('NameScenary')
      expiringLocalStorage.deleteDataWithExpiration('scenario-' + cotId)
      setTimeout(() => {
        const quotationewBack = document.querySelector('#quotationew--back')
        console.log("here");
        quotationewBack.click()
      }, 2000);
    } else if (reqQueryS.status === 400) {
    //  nodeNotification('Valida que los campos estén correctos')
    } else if (reqQueryS.status == 500) {
      nodeNotification('Error 500, Error interno del servidor')
    }
    return resQueryS 
  }
  catch(error) {
    console.error('No se pudo crear las cotizaciones', error);
  }
}

export default putScenario