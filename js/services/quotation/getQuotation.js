import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getQuotation = async () => {
  try {
    const urlQuery = `${API_DEV}/api/Quotation/4/1/0/%20`


    const reqQuery = await fetch(urlQuery)
    const resQuery = await reqQuery.json()    
    if (reqQuery.status == 403) {
      console.error('Error 403');
    } else if (reqQuery.status == 500) {
      console.error('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQuery
    
  }
  
  catch(error) {
    console.error('No se pudo traer las cotizaciones', error);
    const quotationContentList = quotation.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default getQuotation