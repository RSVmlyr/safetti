import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getProduct = async () => {
  try {
    const urlQueryProducts = `${API_DEV}/api/Product`
    const reqQueryProducts = await fetch(urlQueryProducts)
    // console.log('Status Service Products', reqQueryProducts);
    const resQueryProducts = await reqQueryProducts.json()
    // console.log('Array Service Products', resQueryProducts);
    
    if (reqQueryProducts.status == 403) {
      console.log('Error 403');
    } else if (reqQueryProducts.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryProducts
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getProduct