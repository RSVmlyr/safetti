import { config } from "../../../config.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const API_DEV = config.API_KEY_DEV;
const validationQuotation = async (Qid, status, userId, valueImage) => {
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${userId}/${status}`;

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(valueImage)
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    console.log(response);
    if(response.status === 200) {
      const data = await response.json();
      nodeNotification("Validación enviada")
      setTimeout(() => {
        location.reload();
      }, 1500);
    } else if (response.status === 405) {
      console.error("405")
    } else if (response.status == 500) {
      console.error("500")
    }
  } catch (error) {
    console.error('No se pudo cancelar la cotización', error);
  }
};

export default validationQuotation;
