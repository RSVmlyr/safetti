import Fetch from "../Fetch.js"
import nodeNotification from "../../helpers/nodeNotification.js";
import { getTranslation } from "../../lang.js";

const validationQuotation = async (Qid, status, userId, valueImage) => {
  try {
    let formData = new FormData();
    formData.append("file", valueImage);
    const response = await Fetch.put(`/api/Quotation/${Qid}/${userId}/${status}`, formData, false);

    nodeNotification(getTranslation("sending_validation"))

    if(response.status !== "error") {
      nodeNotification(getTranslation("validation_sent"))
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      nodeNotification(getTranslation("unexpected_error"))
    }
  } catch (error) {
    console.error('Hubo un error al cambiar el estado de la cotización', error);
  }
};

export default validationQuotation;
