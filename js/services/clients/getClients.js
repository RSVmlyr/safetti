import Fetch from "../Fetch.js"

const getClients = async () => {
  try {
    const response = await Fetch.get(`/api/User/clients`);
    return response
  }
  catch(error) {
    console.error('No se pudo traer los clientes', error);
  }
}

export default getClients