
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
import nodeNotification from "../../helpers/nodeNotification.js";
import setQuotation from "../../services/quotation/setQuotation.js";

const quotationNewPage = (quotationNew, resQueryUser, resQueryProducts, resQueryClients) => {
  const expiringLocalStorage = new ExpiringLocalStorage()

  // console.log('Object User', resQueryUser);
  // console.log('Object Products', resQueryProducts.products);

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const cotId = searchParams.get('cotId');
  const cotName = searchParams.get('cotName');
  const dateCurrent = new Date()
  const idQnDate = quotationNew.querySelector('#qndate')
  const idQnClient = quotationNew.querySelector('#qnclient')
  let idQnLabelCliente = resQueryUser.rol === "advisors" ? 'Asesor: ' : 'Cliente: ';
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  const idQnLabelAdvisors = resQueryUser.rol === "advisors" ? 'Cliente: ' : 'Asesor: ';
  const resQueryUserAdvisorName = resQueryUser.advisorName === null ? '' : resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  const resQueryUserCurrency = resQueryUser.rol === "advisors" ? '' : resQueryUser.currency; 
  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')
  const qnbusinessname = quotationNew.querySelector('#qnbusinessname')
  const qnrol = quotationNew.querySelector('#qnrol')
  idQnDate.innerHTML = 'Creación: ' + dateFormat(dateCurrent)

  console.log(resQueryUser);
  
  if(resQueryUser.rol === 'advisors') {
    qnrol.classList.remove('quotation-hide')
  } 
  if(resQueryUser.razonSocial===null) {
    qnbusinessname.classList.add('quotation-hide')
  } else {
    idQnLabelCliente = resQueryUser.rol === "advisors" ? 'Asesor: ' : 'Contacto: ';
  }
  idQnClient.innerHTML = idQnLabelCliente + resQueryUser.fullName;
  qnbusinessname.innerHTML ='Razon Social: '  + resQueryUser.razonSocial
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
    // console.log('cotId', cotId);
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
      expiringLocalStorage.saveDataWithExpiration("ClientFullName", JSON.stringify(dataClientStorage))
    }

    const getinfouser = async () => {
      const data = await GetIdQuotation(cotId)   
      // console.log(data);
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
      <label for='quotationewclient'>Buscar Cliente: <span>*</span></label>
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

    const ClientFullName = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    if(ClientFullName){
      const cFulName = JSON.parse(ClientFullName)
      quotatioNewClient.value = cFulName[0].client
      idQnCurrency.innerHTML = 'Moneda: ' + cFulName[0].currency
      if(cFulName[0].razon) {
        qnbusinessname.classList.remove('quotation-hide')
        qnbusinessname.innerHTML = 'Razón social: ' + cFulName[0].razon
        idQnAdvisor.innerHTML = 'Cliente: ' + cFulName[0].client
      } else {
        idQnAdvisor.innerHTML = 'Cliente: ' + cFulName[0].client
      }
      qnrol.innerHTML = 'Cliente: ' + cFulName[0].rol.replace(/_/g, ' ');
      console.log(cFulName[0]);
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
            selectedValueSearchLi(client.razonSocial, client.fullName, client.currency, client.rol, client.id, client.specialDiscount)
          });
          idQuotatioNewSearchClient.appendChild(li);
        });
      } else {
        idQuotatioNewSearchClient.classList.remove('quotationewsearchclient')
        validateNewCleint()
      }
    });

    const selectedValueSearchLi = (razon, client, currency, rol, id, specialDiscount) => {
      const qnClient = quotationNew.querySelector('#qnadvisor')
      const qnCurrency = quotationNew.querySelector('#qncurrency')
      console.log('rol---', razon);
      if(razon) {
        qnClient.textContent = 'Contacto: ' + client
        qnbusinessname.classList.remove('quotation-hide')
        qnbusinessname.innerHTML = 'Razón social: ' + razon
      } else {
        qnClient.textContent = 'Cliente: ' + client
        qnbusinessname.classList.add('quotation-hide')
      }
      qnCurrency.textContent = 'Moneda: ' + currency
      qnrol.textContent = 'Rol: ' + rol.replace(/_/g, ' ');
      const discount = specialDiscount === null ? 0 : parseInt(specialDiscount, 10)

      const dataClientStorage = [
        {
          id,
          client,
          currency,
          rol,
          discount,
          razon
        }
      ]
      expiringLocalStorage.saveDataWithExpiration("ClientFullName", JSON.stringify(dataClientStorage))
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

  // Special 

  if(resQueryUser.rol != "advisors" ) {
    const quotationewCalculationDiscount = quotationNew.querySelector('.quotationew--calculation__discount')
    quotationewCalculationDiscount.remove()
  }
  //-edwin  
  //-edwin quotationewCalculationDiscount.textContent = resQueryUser.specialDiscount ? resQueryUser.specialDiscount + '%' : '0%'
  // Special Discount

  const quotationCalculation = new QuotationCalculation(resQueryUser);

  const quotationBtnSave =  quotationNew.querySelector('#quotation--btn__save')
  cotId && cotName ? quotationBtnSave.textContent = 'Guardar Escenario' : quotationBtnSave.textContent = 'Guardar Cotización'

  const quotatioewScenary = quotationNew.querySelector('#quotationewscenary')
  const quotatioewScenaryNode = quotatioewScenary ? quotatioewScenary.value : false
  const idQuotationComments = quotationNew.querySelector('#quotationcomments')
  const quotatioNewClient = quotationNew.querySelector('#quotationewclient')
  const quotatioNewClientNode = quotatioNewClient ? quotatioNewClient.value : false

  // Name Scenary
  if (quotatioewScenary) {
    quotatioewScenary.addEventListener('input', (e) => {
      const inputValue = e.target.value;
      if (inputValue !== '') {
        expiringLocalStorage.saveDataWithExpiration("NameScenary", JSON.stringify(inputValue));
      } else {
        expiringLocalStorage.saveDataWithExpiration("NameScenary", JSON.stringify(''));
      }
    });
    const commentsText = expiringLocalStorage.getDataWithExpiration('NameScenary');
    if(commentsText) {
      const cText = JSON.parse(commentsText);
      quotatioewScenary.value = cText;
    }
  }

  // Commments Local Storage
  if (idQuotationComments) {
    idQuotationComments.addEventListener('input', (e) => {
      const inputValue = e.target.value;
      if (inputValue !== '') {
        expiringLocalStorage.saveDataWithExpiration("Comments", JSON.stringify(inputValue));
      } else {
        expiringLocalStorage.saveDataWithExpiration("Comments", JSON.stringify(''));
      }
    });
    const commentsText = expiringLocalStorage.getDataWithExpiration('Comments');
    const cText = JSON.parse(commentsText);
    if (cText !== '') {
      idQuotationComments.value = cText;
    }
  }

  const quotationewCalculationDiscountValue = resQueryUser.rol !== 'advisors' ? resQueryUser.specialDiscount : false
  const quotationIva = quotationNew.querySelector('.quotation--iva')

  // const nodeNotification = (text) => {
  //   const notification = document.createElement('div');
  //   notification.classList.add('notification');
  //   notification.textContent = text;
  //   const body = document.querySelector('body')
  //   body.insertAdjacentElement('afterend', notification);
  //   const notificationDiv = document.querySelector('.notification')
  //   setTimeout(() => {
  //     notificationDiv.remove()
  //   }, 10000);
  // }

  
  quotationBtnSave.addEventListener('click', () => {

    const btnSave = () => {

      console.log('click', resQueryUser.rol)

      if (resQueryUser.rol !== 'advisors') {
        if (quotationewname) {
          if (quotationewname.value == '') {
            nodeNotification('Los campos marcados con * son obligatorios')
          }
        }
      } else {
        if (quotationewname && quotatioNewClient) {
          if (quotationewname.value == '' || quotatioNewClientNode == '') {
            nodeNotification('Los campos marcados con * son obligatorios')
          } else {
            expiringLocalStorage.saveDataWithExpiration("NameQuotation", JSON.stringify(quotationewname.value))
          }
        }
      }
      
      if (cotId && cotName) {
        // console.log('Cliente Nuevo Escenario: ', quotatioewScenary.value);
        quotationCalculation.SendNewScenary(resQueryUser, cotId, quotatioewScenary.value)
        if (quotatioewScenary) {
          if (quotatioewScenary.value == '') {
            console.log(quotatioewScenaryNode);
            nodeNotification('Los campos marcados con * son obligatorios')
          } else {
            expiringLocalStorage.saveDataWithExpiration("NameScenary", JSON.stringify(quotatioewScenaryNode.value))
          }
        }
      } else {
        quotationCalculation.SendNewQuotation(resQueryUser, quotationIva.checked, quotationewname.value, idQuotationComments.value );
      }

    }

    btnSave()

  });
  
}

export default quotationNewPage