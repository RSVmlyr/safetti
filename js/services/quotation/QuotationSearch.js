import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;

const QuotationSearch = async (uid, pageNumber, advisorId) => {
  try {
    const urlQueryAdvisors = `${API_DEV}/api/Quotation/search/${uid}/${pageNumber}/10/${advisorId}/%20`
    const reqQueryAdvisors = await fetch(urlQueryAdvisors)
    const resQueryAdvisors = await reqQueryAdvisors.json()
    //console.log('Array Service Advisors', resQueryAdvisors);

    if (reqQueryAdvisors.status == 403) {
      console.log('Error 403');
    } else if (reqQueryAdvisors.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryAdvisors  
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}
export default QuotationSearch
  