import Fetch from "../Fetch.js"

const getProductPrices = async (productId, currency, rol) => {
  try {
    const response = await Fetch.get(`/api/Product/prices/${productId}/${currency}/${rol}`)

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.info('No se pudo traer los precios', error);
  }
}

export default getProductPrices