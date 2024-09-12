import nodeNotification from "../../helpers/nodeNotification.js";
import ExpiringLocalStorage from '../../components/localStore/ExpiringLocalStorage.js';
import Fetch from "../Fetch.js"
import { getTranslation } from "../../lang.js";

const setQuotation = async dataSetQuotation => {
  try {
    const response = await Fetch.post('/api/Quotation', dataSetQuotation)

    if(response.status !== "error") {
      nodeNotification(getTranslation("saving_quotation"))
      const expiringLocalStorage = new ExpiringLocalStorage()
      expiringLocalStorage.deleteDataWithExpiration('ClientFullName')
      expiringLocalStorage.deleteDataWithExpiration('Comments')
      expiringLocalStorage.deleteDataWithExpiration('products')

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
    console.error('No se pudo guardar la cotización', error);
    const quotationContentList = document.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default setQuotation