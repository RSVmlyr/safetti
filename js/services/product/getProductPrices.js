import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getProductPrices = async (productId, currency, rol) => {
  try {
    const url = `${API_DEV}/api/Product/prices/${productId}/${currency}/${rol}` 
    const reqQueryProducts = await fetch(url)
    const data = await reqQueryProducts.json()
    
    if (reqQueryProducts.status == 403) {
      console.log('Error 403');
    } else if (reqQueryProducts.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return data
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getProductPrices