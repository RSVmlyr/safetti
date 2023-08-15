import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getQuotation = async () => {
  try {
    // const urlQuery = `${API_DEV}/api/Quotation/client/${id}`
    // const urlQuery = 'https://safetticustom.azurewebsites.net/api/Quotation/client/' + id
    // const urlQuery = 'https://safetticustom.azurewebsites.net/api/Quotation/4/1/0/%20'
    const urlQuery = `${API_DEV}/api/Quotation/4/1/0/%20`

    console.log(API_DEV);
    const reqQuery = await fetch(urlQuery)
    const resQuery = await reqQuery.json()
    //console.log('Array Service Quotation', resQuery);
    
    if (reqQuery.status == 403) {
      console.log('Error 403');
    } else if (reqQuery.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQuery
    
  }
  
  catch(error) {
    console.log('No se pudo traer las cotizaciones', error);
    const quotationContentList = quotation.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default getQuotation