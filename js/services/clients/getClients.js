const getClients = async (resQueryClients) => {
  try {
    const urlQueryClients = 'https://safetticustom.azurewebsites.net/api/User/clients'
    const reqQueryClients = await fetch(urlQueryClients)
    // console.log('Status Service Clients', reqQueryClients);
    const resQueryClients = await reqQueryClients.json()
    // console.log('Array Service Clients', resQueryClients);
    
    return resQueryClients
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getClients