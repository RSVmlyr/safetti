import { config } from "../../../config.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const API_DEV = config.API_KEY_DEV;
const validationQuotation = async (Qid, status, userId, valueImage) => {

  let formData = new FormData();
  formData.append("file", valueImage);

  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${userId}/${status}`;

    const requestOptions = {
      method: 'PUT',
      body: formData
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    nodeNotification("Enviando validación...")
    if(response.status === 200) {
      nodeNotification("Validación enviada")
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

export default validationQuotation;
