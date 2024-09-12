import nodeNotification from "../../helpers/nodeNotification.js";
import ExpiringLocalStorage from '../../components/localStore/ExpiringLocalStorage.js';
import Fetch from "../Fetch.js"
import { getTranslation } from "../../lang.js";

const setScenario = async (dataSetScenario, cotId) => {
  try {
    const response = await Fetch.post('/api/Scenario', dataSetScenario)

    if(response.status !== "error") {
      nodeNotification(getTranslation("saving_scenario"))
      const expiringLocalStorage = new ExpiringLocalStorage()
      expiringLocalStorage.deleteDataWithExpiration('NameScenary')
      expiringLocalStorage.deleteDataWithExpiration('scenario-' + cotId)

      setTimeout(() => {
        const quotationewBack = document.querySelector('#quotationew--back')
        quotationewBack.click()
      }, 1000);
    } else {
      nodeNotification(getTranslation("internal_server_error"))
    }

    return response
  }
  catch(error) {
    console.error('No se pudo guardar el escenarios', error);
  }
}

export default setScenario