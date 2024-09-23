import Fetch from "../Fetch.js"
import nodeNotification from "../../helpers/nodeNotification.js";
import { getTranslation } from "../../lang.js";

const putQuotationScenario = async (id) => {
  try {
    const response = await Fetch.put(`/api/Quotation/activatescenario/${id}`);

    if(response.status !== "error") {
      nodeNotification(getTranslation("selecting_scenario"))
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      nodeNotification(getTranslation("internal_server_error"))
    }
  } catch (error) {
    console.error('No se pudo activar el escenario', error);
  }
};

export default putQuotationScenario