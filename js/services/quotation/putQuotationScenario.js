import Fetch from "../Fetch.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const putQuotationScenario = async (id) => {
  try {
    const response = await Fetch.put(`/api/Quotation/activatescenario/${id}`);

    if(response.status !== "error") {
      nodeNotification('Seleccionando escenario...')
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      nodeNotification('Error interno del servidor')
    }
  } catch (error) {
    console.error('No se pudo activar el escenario', error);
  }
};

export default putQuotationScenario