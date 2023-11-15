import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const statusQuotationS = async (Qid, status, userId) => {
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${userId}/${status}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    const data = await response.json();


  } catch (error) {
    console.log('No se pudo cancelar la cotización', error);
  }
};

export default statusQuotationS;
