import { config } from "../../../config.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const API_DEV = config.API_KEY_DEV;
const statusQuotationS = async (Qid, status, userId, advance) => {
  const a = advance !=null ? advance  : '' 
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${userId}/${status}/${a}`;
    // api/Quotation/{quotationId}/{userId}/4/{advance} si necesita anticipo
    // api/Quotation/{quotationId}/{userId}/4/0 si no necesita anticipo 
    
    // desde drupal en landing aprobar
    // en drupal si es 0 porcentaje api/Quotation/{quotationId}/{userId}/2/
    // si no   api/Quotation/{quotationId}/{userId}/5/

    // api/Quotation/{quotationId}/{userId}/2/ para subir con el file

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    
    if(response.status === 200) {
      nodeNotification("Estado cambiado de la cotización")
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (response.status === 405) {
      nodeNotification("Hubo un error inesperado, intenta mas tarde.")
      console.error("405")
    } else if (response.status == 500) {
      nodeNotification("Hubo un error inesperado, intenta mas tarde.")
      console.error("500")
    }
  } catch (error) {
    console.error('Hubo un error al cambiar el estado de la cotización', error);
  }
};

export default statusQuotationS;
