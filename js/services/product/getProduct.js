import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getProduct = async () => {
  try {
    const urlQueryProducts = `${API_DEV}/api/Product`
    const reqQueryProducts = await fetch(urlQueryProducts)
    const resQueryProducts = await reqQueryProducts.json()
    if (reqQueryProducts.status == 403) {
      console.error('Error 403');
    } else if (reqQueryProducts.status == 500) {
      console.error('Error 500. Ocurrió un error al procesar su solicitud.');
    }
    return resQueryProducts
  }
  catch(error) {
    console.error('No se pudo traer los asesores', error);
  }
}

export default getProduct