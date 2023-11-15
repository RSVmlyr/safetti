import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;

const getClients = async (resQueryClients) => {
  try {
    const urlQueryClients = `${API_DEV}/api/User/clients`;
    const reqQueryClients = await fetch(urlQueryClients);
    const resQueryClients = await reqQueryClients.json();
    return resQueryClients
  }
  
  catch(error) {
    console.error('No se pudo traer los asesores', error);
  }
}

export default getClients