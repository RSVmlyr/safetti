import Fetch from "../Fetch.js"

const getQuotation = async (Qid) => {
  try {
    const response = await Fetch.get(`/api/Quotation/${Qid}`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo traer las cotizaciones', error);
    const quotationContentList = quotation.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default getQuotation