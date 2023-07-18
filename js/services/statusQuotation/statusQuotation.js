const statusQuotationS = async (Qid, status) => {
  try {
    const urlQuerySQ = `https://safetticustom.azurewebsites.net/api/Quotation/${Qid}/${status}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    const response = await fetch(urlQuerySQ, requestOptions);
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log('No se pudo cancelar la cotización', error);
  }
};

export default statusQuotationS;
