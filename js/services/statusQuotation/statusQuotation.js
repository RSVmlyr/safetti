import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const statusQuotationS = async (Qid, status) => {
  try {
    const urlQuerySQ = `${API_DEV}/api/Quotation/${Qid}/${status}`;
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
