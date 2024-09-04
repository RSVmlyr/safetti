import Fetch from "../Fetch.js"

const QuotationSearch = async (uid, pageNumber, pageSize, advisorId, clientName) => {
  try {
    const response = await Fetch.get(`/api/Quotation/search/${uid}/${pageNumber}/${pageSize}/${advisorId}/${clientName}`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo realizar la búsqueda', error);
  }
}
export default QuotationSearch