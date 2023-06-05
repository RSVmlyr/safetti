const getAdvisors = async () => {
  try {
    const urlQueryAdvisors = 'https://safetticustom.azurewebsites.net/api/User/advisors'
    const reqQueryAdvisors = await fetch(urlQueryAdvisors)
    console.log('Status Service Advisors', reqQueryAdvisors);
    const resQueryAdvisors = await reqQueryAdvisors.json()
    console.log('Array Service Advisors', resQueryAdvisors);
    
    if (reqQueryAdvisors.status == 403) {
      console.log('Error 403');
    } else if (reqQueryAdvisors.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryAdvisors
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getAdvisors