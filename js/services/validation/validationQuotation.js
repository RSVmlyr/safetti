import Fetch from "../Fetch.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const validationQuotation = async (Qid, status, userId, valueImage) => {
  try {
    let formData = new FormData();
    formData.append("file", valueImage);
    const response = await Fetch.put(`/api/Quotation/${Qid}/${userId}/${status}`, formData, false);

    nodeNotification("Enviando validación...")

    if(response.status !== "error") {
      nodeNotification("Validación enviada")
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      nodeNotification("Hubo un error inesperado, intenta mas tarde.")
    }
  } catch (error) {
    console.error('Hubo un error al cambiar el estado de la cotización', error);
  }
};

export default validationQuotation;
