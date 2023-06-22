const getUser = async (uid) => {
  try {
    const urlQueryUser = `https://safetticustom.azurewebsites.net/api/User/${uid}`
    const reqQueryUser = await fetch(urlQueryUser)
    // console.log('Status Service User', reqQueryUser);
    const resQueryUser = await reqQueryUser.json()
    // console.log('Object Service User', resQueryUser);
    
    if (reqQueryUser.status == 403) {
      console.log('Error 403');
    } else if (reqQueryUser.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQueryUser
    
  }
  
  catch(error) {
    console.log('No se pudo traer los asesores', error);
  }
}

export default getUser