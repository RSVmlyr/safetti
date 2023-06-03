const getQuotation = async (id) => {
  try {
    const urlQuery = 'https://safetticustom.azurewebsites.net/api/Quotation/client/' + id
    const reqQuery = await fetch(urlQuery)
    console.log(reqQuery);
    const resQuery = await reqQuery.json()
    
    if (reqQuery.status == 403) {
      console.log('Error 403');
    } else if (reqQuery.status == 500) {
      console.log('Error 500. Ocurrió un error al procesar su solicitud.');
    }

    return resQuery
    
  }
  
  catch(error) {
    console.log('No se pudo traer las cotizaciones', error);
    const quotationContentList = quotation.querySelector('#quotation--content--list')
    quotationContentList.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span>No existen Cotizaciones...</span></div>')
  }
}

export default getQuotation