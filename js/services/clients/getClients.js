import { config } from "../../../config.js"

const API_DEV = config.API_KEY_DEV;

const getClients = async (resQueryClients) => {
  try {
    const urlQueryClients = `${API_DEV}/api/User/clients`;
    const reqQueryClients = await fetch(urlQueryClients);
    // console.log('Status Service Clients', reqQueryClients);
    const resQueryClients = await reqQueryClients.json();
    // console.log('Array Service Clients', resQueryClients);
    
    return resQueryClients
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getClients