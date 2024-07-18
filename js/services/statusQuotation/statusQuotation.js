import Fetch from "../Fetch.js"
import nodeNotification from "../../helpers/nodeNotification.js";

const statusQuotationS = async (Qid, status, userId, advance) => {
  const a = advance !=null ? advance  : '' 
  try {
    // api/Quotation/{quotationId}/{userId}/4/{advance} si necesita anticipo
    // api/Quotation/{quotationId}/{userId}/4/0 si no necesita anticipo 
    
    // desde drupal en landing aprobar
    // en drupal si es 0 porcentaje api/Quotation/{quotationId}/{userId}/2/
    // si no   api/Quotation/{quotationId}/{userId}/5/

    // api/Quotation/{quotationId}/{userId}/2/ para subir con el file

    const response = await Fetch.put(`/api/Quotation/${Qid}/${userId}/${status}/${a}`);

    if(response.status !== "error") {
      nodeNotification("Estado cambiado de la cotización")
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

export default statusQuotationS;
