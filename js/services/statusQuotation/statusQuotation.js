import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const statusQuotationS = async (Qid, status, userId, advance) => {
  const a = advance != null ? advance  : ''
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${userId}/${status}/${a}`;
    // api/Quotation/{quotationId}/{userId}/4/{advance} si necesita anticipo
    // api/Quotation/{quotationId}/{userId}/2/ si no necesita anticipo 
    // api/Quotation/{quotationId}/{userId}/2/ para subir con el file
    // api/Quotation/{quotationId}/{userId}/5/ desde drupal en landing aprobar 
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await fetch(urlQuerySQ, requestOptions);
    if(response.status === 200) {
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else if (response.status == 500) {
      console.error('Error 500, Error interno del servidor')
    }
    return resQuery 
  } catch (error) {
    console.error('No se pudo actualizar la cotización', error);
  }
};

export default statusQuotationS;
