import Fetch from "../Fetch.js"

const getProduct = async () => {
  try {
    const response = await Fetch.get('/api/Product')

    if (response.status === "error") {
      console.error(response.message);
    }

    return response
  }
  catch(error) {
    console.error('No se pudo traer los productos', error);
  }
}

export default getProduct