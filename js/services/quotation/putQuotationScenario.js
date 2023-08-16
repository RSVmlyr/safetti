import { config } from "../../../config.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const API_DEV = config.API_KEY_DEV;
const putQuotationScenario = async (id) => {
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/activatescenario/${id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    const data = await response.json();

    // console.log('r', response);
    // console.log('d', data);

    if(response.status === 200) {
      nodeNotification('Seleccionando escenario...')
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else if (response.status == 500) {
      nodeNotification('Error 500, Error interno del servidor')
    }

  } catch (error) {
    console.log('No se pudo cancelar la cotización', error);
  }
};

export default putQuotationScenario