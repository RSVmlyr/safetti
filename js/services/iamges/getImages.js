const getIamages = async (id) => {
  try {
    const urlQueryImages= `https://safetticustom.azurewebsites.net/api/Product/images/${id}`
    const reqQueryImages= await fetch(urlQueryImages)
    // console.log('Status Service Images', reqQueryImages);
    const resQueryImages= await reqQueryImages.json()
    // console.log('Array Service Images', resQueryImages);
    
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