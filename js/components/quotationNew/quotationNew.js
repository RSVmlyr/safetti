
import dateFormat from "../../helpers/dateFormat.js";
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
import sendEmailHelper from "../../helpers/sendEmailHelper.js";
import createProductCards from "./createProductsCards.js";
import localStorage from "./localStorage.js";
import searchProduct from "./searchProduct.js";

const quotationNewPage = (quotationNew, resQueryUser, resQueryProducts) => {
  
  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts.products);

  const dateCurrent = new Date()
  const idQnDate = quotationNew.querySelector('#qndate')
  idQnDate.innerHTML = 'Creación: ' + dateFormat(dateCurrent)

  const idQnClient = quotationNew.querySelector('#qnclient')
  idQnClient.innerHTML = 'Cliente: ' + resQueryUser.fullName
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  idQnAdvisor.innerHTML = 'Asesor: ' + resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  idQnCurrency.innerHTML = 'Moneda: ' + resQueryUser.currency

  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda)

  createProductCards(quotationNew, resQueryUser, resQueryProducts)

  // Search Product
  searchProduct(quotationNew, resQueryUser, resQueryProducts)
  // Search Product

  localStorage()

  // Obtener la URL actual
  var url = new URL(window.location.href);

  // Obtener el objeto URLSearchParams
  var searchParams = new URLSearchParams(url.search);

  // Obtener el valor del parámetro 'cotId'
  var cotId = searchParams.get('cotId');
  var cotName = searchParams.get('cotName');

  // Reemplazar %20 por espacios en blanco en cotName
  // cotName = cotName.replace(/%20/g, ' ');

  // Imprimir los valores de los parámetros
  // console.log(cotId);
  // console.log(cotName);

  const QnEmail = quotationNew.querySelector('.quotation--email')
  cotId ? false : QnEmail.remove()
  const QnDownload = quotationNew.querySelector('.quotation--download')
  cotId ? false : QnDownload.remove()
  const QnComments = quotationNew.querySelector('.quotationcomments')
  cotId ? false : QnComments.classList.remove('quotation-hide')
  const QnTitle = quotationNew.querySelector('.quotationew__title .quotation--title')
  cotId ? QnTitle.textContent = 'Nuevo Escenario' : QnTitle.textContent = 'Nueva Cotización'
  const quotationewname = quotationNew.querySelector('#quotationewname')
  if (cotId && quotationewname) {
    quotationewname.disabled = true
    quotationewname.value = cotName
    const quotationewInfo = quotationNew.querySelector('.quotationew__info')
    let quotatioNewInfoTwo =
    `<div class="quotationew__infoTwo">
      <label class="quotation--title__quo">Nombre del Escenario: <span>*</span></label>
      <input id="quotationewscenary" type="text" placeholder="Nombre Escenario" required>
    </div>
    `
    quotationewInfo.insertAdjacentHTML('beforeend', `${quotatioNewInfoTwo}`)
  }

  const quotationDownload = quotationNew.querySelector('.quotation--download')
  quotationDownload.setAttribute('href', `https://safetticustom.azurewebsites.net/api/Quotation/pdf/${cotId}`);
  const quotationEmail = quotationNew.querySelector('.quotation--email')
  quotationEmail.setAttribute('href', `https://safetticustom.azurewebsites.net/api/Quotation/email/${cotId}`);
  const quotationEmailSendData = quotationNew.querySelector('.quotation--send--data')
  sendEmailHelper(quotationEmail, quotationEmailSendData)

}

export default quotationNewPage