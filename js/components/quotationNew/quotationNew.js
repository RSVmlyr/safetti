
import dateFormat from "../../helpers/dateFormat.js";
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
import sendEmailHelper from "../../helpers/sendEmailHelper.js";
import createProductCards from "./createProductsCards.js";
import localStorage from "./localStorage.js";
import searchProduct from "./searchProduct.js";
import QuotationCalculation from './QuotationCalculation.js';
import GetIdQuotation from "../../services/quotation/getIdQuotation.js";
import ExpiringLocalStorage from "../localStore/ExpiringLocalStorage.js";
import getUser from "../../services/user/getUser.js"

const quotationNewPage = (quotationNew, resQueryUser, resQueryProducts, resQueryClients) => {
  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts.products);
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const cotId = searchParams.get('cotId');
  const cotName = searchParams.get('cotName');
  const dateCurrent = new Date()
  const idQnDate = quotationNew.querySelector('#qndate')
  const idQnClient = quotationNew.querySelector('#qnclient')
  const idQnLabelCliente = resQueryUser.rol === "advisors" ? 'Asesor: ' : 'Cliente: ';
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  const idQnLabelAdvisors = resQueryUser.rol === "advisors" ? 'Cliente: ' : 'Asesor: ';
  const resQueryUserAdvisorName = resQueryUser.advisorName === null ? '' : resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  const resQueryUserCurrency = resQueryUser.rol === "advisors" ? '' : resQueryUser.currency; 
  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')

  idQnDate.innerHTML = 'Creación: ' + dateFormat(dateCurrent)
  idQnClient.innerHTML = idQnLabelCliente + resQueryUser.fullName;
  idQnAdvisor.innerHTML = idQnLabelAdvisors + resQueryUserAdvisorName
  idQnCurrency.innerHTML = 'Moneda: ' + resQueryUserCurrency
  
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda)
  createProductCards(quotationNew, resQueryUser, resQueryProducts)
  searchProduct(quotationNew, resQueryUser, resQueryProducts)
  localStorage()
  if(cotId && resQueryUser.rol === 'advisors'){
    console.log('cotId', cotId);
    //llamar servicio
    const getUserCurren = async (id) => {
      const user = await getUser(id) 
      console.log(user);
      const dataClientStorage = [
        {
          id: user.id,
          client: user.fullName,
          currency: user.currency,
          rol: user.rol,
        }
      ]
      ExpiringLocalStorage.saveDataWithExpiration("ClientFullName", JSON.stringify(dataClientStorage))
    }

    const getinfouser = async () => {
      const data = await GetIdQuotation(cotId)   
      console.log(data);
      idQnAdvisor.innerHTML = idQnLabelAdvisors + data.clientName
      idQnCurrency.innerHTML = 'Moneda: ' + data.currency
      getUserCurren(data.client);
      
    }
    
    getinfouser()
  }

  const QnEmail = quotationNew.querySelector('.quotation--email')
  cotId ? false : QnEmail.remove()
  const QnDownload = quotationNew.querySelector('.quotation--download')
  cotId ? false : QnDownload.remove()
  const QnComments = quotationNew.querySelector('.quotationcomments')
  cotId ? false : QnComments.classList.remove('quotation-hide')
  const QnTitle = quotationNew.querySelector('.quotationew__title .quotation--title')
  cotId ? QnTitle.textContent = 'Nuevo Escenario' : QnTitle.textContent = 'Nueva Cotización'
  const quotationewname = quotationNew.querySelector('#quotationewname')

  const NameQuotation = ExpiringLocalStorage.getDataWithExpiration('NameQuotation')
  const nQuotation = JSON.parse(NameQuotation)
  quotationewname.value = nQuotation

  if (cotId && quotationewname) {
    quotationewname.disabled = true
    quotationewname.value = cotName
    const quotationewInfo = quotationNew.querySelector('.quotationew__info')
    let quotatioNewInfoTwo =
    `<div class="quotationew__infoTwo">
      <label class="quotation--title__quo" for='quotationewscenary'>Nombre del Escenario: <span>*</span></label>
      <input id="quotationewscenary" type="text" placeholder="Nombre Escenario" required>
    </div>
    `
    quotationewInfo.insertAdjacentHTML('beforeend', `${quotatioNewInfoTwo}`)
  }

  if (resQueryUser.rol === 'advisors' && cotId === null) {
    let quotatioNewSearchClient =
    `<div class='quotationew__searchclient'>
      <label for='quotationewclient'>Buscar Cliente:</label>
      <input id="quotationewclient" type="text" placeholder="Escribe el Nombre del cliente" required>
      <ul id="quotationewsearchclient"></ul>
     </div>
    `
    quotationewname.insertAdjacentHTML('afterend', `${quotatioNewSearchClient}`)

    const quotatioNewClient = quotationNew.querySelector('#quotationewclient')
    const idQuotatioNewSearchClient = quotationNew.querySelector('#quotationewsearchclient')
    const sliderProductos = quotationNew.querySelectorAll('.slider--productos .slider--row .card--actions .qnaddproducts')

    const validateNewCleint = () => {
      if (quotatioNewClient.value !== '') {
        sliderProductos.forEach(add => {
          add.style.display = 'block';
        });
      } else {
        sliderProductos.forEach(add => {
          add.style.display = 'none';
        });
      }
    }

    validateNewCleint()

    const ClientFullName = ExpiringLocalStorage.getDataWithExpiration('ClientFullName')
    if(ClientFullName){
      const cFulName = JSON.parse(ClientFullName)
      quotatioNewClient.value = cFulName[0].client
      validateNewCleint()
    }

    quotatioNewClient.addEventListener('input', (e) => {
      let searchTerm = e.target.value.trim().toLowerCase();
      idQuotatioNewSearchClient.innerHTML = '';
      if (searchTerm !== '') {
        const filteredClients = resQueryClients.filter(client =>
          client.fullName.toLowerCase().includes(searchTerm)
        );
        const sortedClients = filteredClients.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );
        sortedClients.forEach(client => {
          idQuotatioNewSearchClient.classList.add('quotationewsearchclient')
          const li = document.createElement('li');
          li.textContent = client.fullName ? client.fullName : '';
          li.setAttribute('data-currency', client.currency ? client.currency : '')
          li.setAttribute('data-rol', client.rol ? client.rol : '')
          li.addEventListener('click', function() {
            idQuotatioNewSearchClient.classList.remove('quotationewsearchclient')
            validateNewCleint()
            quotatioNewClient.value = client.fullName ? client.fullName : '';
            idQuotatioNewSearchClient.innerHTML = '';
            selectedValueSearchLi(client.fullName, client.currency, client.rol, client.id)
          });
          idQuotatioNewSearchClient.appendChild(li);
        });
      } else {
        validateNewCleint()
      }
    });

    const selectedValueSearchLi = (client, currency, rol, id) => {
      const qnClient = quotationNew.querySelector('#qnadvisor')
      const qnCurrency = quotationNew.querySelector('#qncurrency')
      qnClient.textContent = 'Cliente: ' + client
      qnCurrency.textContent = 'Moneda: ' + currency
      const dataClientStorage = [
        {
          id,
          client,
          currency,
          rol
        }
      ]
      ExpiringLocalStorage.saveDataWithExpiration("ClientFullName", JSON.stringify(dataClientStorage))
    }

    const quotatioNewSearchClientLi = quotationNew.querySelectorAll('#quotationewsearchclient li')
      if (quotatioNewSearchClientLi.length > 0) {
        console.log(quotatioNewSearchClientLi);
        quotatioNewSearchClientLi.addEventListener('click', (e) => {
          console.log(e.target);
        })
      }    
  } 

  const quotationDownload = quotationNew.querySelector('.quotation--download')
  if (quotationDownload) {
    quotationDownload.setAttribute('href', `https://safetticustom.azurewebsites.net/api/Quotation/pdf/${cotId}`);
  }
  const quotationEmail = quotationNew.querySelector('.quotation--email')
  if (quotationEmail) {
    quotationEmail.setAttribute('href', `https://safetticustom.azurewebsites.net/api/Quotation/email/${cotId}`);
    const quotationEmailSendData = quotationNew.querySelector('.quotation--send--data')
    sendEmailHelper(quotationEmail, quotationEmailSendData)
  }

  // Special Discount
  const quotationewCalculationDiscount = quotationNew.querySelector('.quotationew--calculation__discount span')
  quotationewCalculationDiscount.textContent = resQueryUser.specialDiscount ? resQueryUser.specialDiscount + '%' : '0%'
  // Special Discount

  const quotationCalculation = new QuotationCalculation(resQueryUser);

  const quotationBtnSave =  quotationNew.querySelector('#quotation--btn__save')
  cotId && cotName ? quotationBtnSave.textContent = 'Guardar Escenario' : quotationBtnSave.textContent = 'Guardar Cotización'

  const quotatioewScenary = quotationNew.querySelector('#quotationewscenary')
  const quotatioewScenaryNode = quotatioewScenary ? quotatioewScenary.value : false
  const idQuotationComments = quotationNew.querySelector('#quotationcomments')

  const commentsText = ExpiringLocalStorage.getDataWithExpiration('Comments')
  const cText = JSON.parse(commentsText)
  idQuotationComments.value = cText

  const quotationewCalculationDiscountValue = resQueryUser.rol !== 'advisors' ? resQueryUser.specialDiscount : false
  const quotationIva = quotationNew.querySelector('.quotation--iva')
  let v = false
  quotationBtnSave.addEventListener('click', () => {
    if (quotationewname.value === '' || quotatioewScenaryNode === '') {
      const error = document.createElement('span');
      error.classList.add('error');
      error.textContent = 'Este campo es obligatorio';
      quotationewname.insertAdjacentElement('afterend', error);
      quotatioewScenary ? quotatioewScenary.insertAdjacentElement('afterend', error) : false
    } else {
      ExpiringLocalStorage.saveDataWithExpiration("NameQuotation", JSON.stringify(quotationewname.value))
      ExpiringLocalStorage.saveDataWithExpiration("NameScenary", JSON.stringify(quotatioewScenaryNode.value))
    }
    const nodeError = quotationNew.querySelector('.error');
    if (quotationewname) {
      quotationewname.addEventListener('input', (e) => {
        if (e.target.value !== '') {
          nodeError ? nodeError.style.display = 'none' : false
          v = true
          console.log('333', e);
        } else {
          v = false
          nodeError.style.display = 'block'
        }
      });
    }
    if (quotatioewScenary) {
      quotatioewScenary.addEventListener('input', (e) => {
        if (e.target.value !== '') {
          nodeError ? nodeError.style.display = 'none' : false
          console.log('444', e);
        } else {
          nodeError.style.display = 'block'
        }
      });
    }

    idQuotationComments.value !== '' ? ExpiringLocalStorage.saveDataWithExpiration("Comments", JSON.stringify(idQuotationComments.value)) : false

    if (cotId && cotName) {
      console.log('Cliente Nuevo Escenario: ', quotatioewScenary.value);
      quotationCalculation.SendNewScenary(resQueryUser, cotId, quotatioewScenary.value)
    } else {
      quotationCalculation.SendNewQuotation(resQueryUser, quotationIva.checked, quotationewname.value, idQuotationComments.value );
    }
    if(v === true) {
      console.log('Name: ', quotationewname.value);
      console.log('Comentarios: ', idQuotationComments.value);
      console.log('Especial Discount', quotationewCalculationDiscountValue);
      console.log('IVA', quotationIva.checked);
    }
  });
  
}

export default quotationNewPage