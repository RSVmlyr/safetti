import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;
const getIamages = async (id) => {
  try {
    const urlQueryImages= `${API_DEV}/api/Product/images/${id}`
    const reqQueryImages= await fetch(urlQueryImages)
    const resQueryImages= await reqQueryImages.json()
    
    if (reqQueryImages.status == 403) {
      console.log('Error 403');
    } else if (reqQueryImages.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryImages
    
  }
  
  catch(error) {
    console.log('No se pudo traer las imágenes', error);
  }
}

export default getIamages