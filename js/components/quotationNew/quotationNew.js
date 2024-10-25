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
import qnaddproduct from "../../helpers/qnaddproduct.js"
import { getTranslation, loadTranslations } from "../../lang.js";

const quotationNewPage = async (quotationNew, resQueryUser, resQueryProducts, resQueryClients) => {
  const expiringLocalStorage = new ExpiringLocalStorage()
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const cotId = searchParams.get('cotId');
  const cotName = searchParams.get('cotName');
  const dateCurrent = new Date()
  const idQnDate = quotationNew.querySelector('#qndate')
  const idQnClient = quotationNew.querySelector('#qnclient')
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  const resQueryUserAdvisorName = resQueryUser.advisorName === null ? '' : resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  const resQueryUserCurrency = resQueryUser.rol === "advisors" ? '' : resQueryUser.currency; 
  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')
  const qnbusinessname = quotationNew.querySelector('#qnbusinessname')
  const qnrol = quotationNew.querySelector('#qnrol')
  idQnDate.innerHTML = dateFormat(dateCurrent)

  if(resQueryUser.rol === 'advisors') {
    qnrol.parentElement.classList.remove('quotation-hide')
  }

  if(resQueryUser.razonSocial === null) {
    qnbusinessname.parentElement.classList.add('quotation-hide')
  }

  idQnClient.innerHTML = `${ await getTranslation("client") }: ${ resQueryUser.fullName }`;
  qnbusinessname.innerHTML = resQueryUser.razonSocial
  idQnAdvisor.innerHTML = resQueryUserAdvisorName
  idQnCurrency.innerHTML = resQueryUserCurrency
  idQnCurrency.dataset.currency = resQueryUserCurrency;
 
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos, false)
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda, true)
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones, true)
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda, true)
  await createProductCards(quotationNew, resQueryUser, resQueryProducts, true)
  await searchProduct(quotationNew, resQueryUser, resQueryProducts)
  localStorage()

  if(cotId && resQueryUser.rol === 'advisors'){
    const getUserCurren = async (id) => {
      const user = await getUser(id)
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
      idQnClient.innerHTML = `${ await getTranslation("client") }: ${ data.clientName }`
      idQnCurrency.innerHTML = data.currency
      idQnCurrency.dataset.currency = data.currency;
      await getUserCurren(data.client); 
    }
    await getinfouser()
  }

  const QnEmail = quotationNew.querySelector('.quotation--email')
  cotId ? false : QnEmail.remove()
  const QnDownload = quotationNew.querySelector('.quotation--download')
  cotId ? false : QnDownload.remove()
  const QnComments = quotationNew.querySelector('.quotationcomments')
  cotId ? false : QnComments.classList.remove('quotation-hide')
  const QnTitle = quotationNew.querySelector('.quotationew__title .quotation--title [data-tkey=new_quotation]')
  const QnScenarioTitle = quotationNew.querySelector('.quotationew__title .quotation--title [data-tkey=new_scenario]')
  if(cotId){
    QnScenarioTitle.classList.remove('quotation-hide')
    QnTitle.classList.add('quotation-hide')
  } else {
    QnScenarioTitle.classList.add('quotation-hide')
    QnTitle.classList.remove('quotation-hide')
  }
  const quotationewname = quotationNew.querySelector('#quotationewname')

  if (cotId && quotationewname) {
    quotationewname.disabled = true
    quotationewname.value = cotName
    const quotationewInfo = quotationNew.querySelector('.quotationew__info')
    let quotatioNewInfoTwo =
    `<div class="quotationew__infoTwo">
      <label class="quotation--title__quo" for='quotationewscenary'><span data-tkey="scenario_name"></span>: <span>*</span></label>
      <input id="quotationewscenary" type="text" data-tkey="scenario_name_placeholder" data-tattr="placeholder" placeholder="" required>
      <span class="error-input quotation-hide" data-tkey="mandatory_field"></span>
    </div>
    `
    quotationewInfo.insertAdjacentHTML('beforeend', `${quotatioNewInfoTwo}`)
  }

  if (resQueryUser.rol === 'advisors' && cotId === null) {
    let quotatioNewSearchClient =
    `<div class='quotationew__searchclient'>
      <label for='quotationewclient'><span data-tkey="client_name"></span>: <span>*</span></label>
      <input id="quotationewclient" type="text" data-tkey="client_name_placeholder" data-tattr="placeholder" placeholder="" required>
      <span class="error-input quotation-hide" data-tkey="mandatory_field"></span>
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

    if (ClientFullName) {
      const cFulName = JSON.parse(ClientFullName)
      if(cFulName[0].length > 0){
        quotatioNewClient.value = cFulName[0].client
        idQnCurrency.innerHTML = 'Moneda: ' + cFulName[0].currency
        idQnCurrency.dataset.currency = cFulName[0].currency;

        if(cFulName[0].razon) {
          qnbusinessname.classList.remove('quotation-hide')
          qnbusinessname.innerHTML = 'Razón social: ' + cFulName[0].razon
          idQnAdvisor.innerHTML = 'Cliente: ' + cFulName[0].client
        } else {
          idQnAdvisor.innerHTML = 'Cliente: ' + cFulName[0].client
        }
        qnrol.innerHTML = 'Cliente: ' + cFulName[0].rol.replace(/_/g, ' ');
        validateNewCleint()
      }
    } 

    quotatioNewClient.addEventListener('input', (e) => {
      let searchTerm = e.target.value.trim().toLowerCase();
      idQuotatioNewSearchClient.innerHTML = '';
      if (searchTerm !== '') {

        const filteredClients = resQueryClients.filter(client =>
          client.fullName.toLowerCase().includes(searchTerm),
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
          li.addEventListener('click', async function() {
            expiringLocalStorage.deleteDataWithExpiration('products')

            const scenaryDeleteAll = quotationNew.querySelector('.scenary-delete__all')
            if  (scenaryDeleteAll) {
              scenaryDeleteAll.click()
            }

            idQuotatioNewSearchClient.classList.remove('quotationewsearchclient')
            validateNewCleint()
            quotatioNewClient.value = client.fullName ? client.fullName : '';
            idQuotatioNewSearchClient.innerHTML = '';
            await selectedValueSearchLi(client.razonSocial, client.fullName, client.currency, client.rol, client.id, client.specialDiscount)
          });
          idQuotatioNewSearchClient.appendChild(li);
        });
      } else {
        idQuotatioNewSearchClient.classList.remove('quotationewsearchclient')
        validateNewCleint()
      }
    });

    const selectedValueSearchLi = async (razon, client, currency, rol, id, specialDiscount) => {
      const qnClient = quotationNew.querySelector('#qnclient')
      const qnCurrency = quotationNew.querySelector('#qncurrency')

      if(razon) {
        qnbusinessname.parentElement.classList.remove('quotation-hide')
        qnbusinessname.innerHTML = razon
        qnClient.textContent = `${ await getTranslation("contact") }: ${client}`
      } else {
        qnbusinessname.parentElement.classList.add('quotation-hide')
        qnClient.textContent = `${ await getTranslation("client") }: ${client}`
      }

      qnCurrency.textContent = currency
      qnCurrency.dataset.currency = currency;
      qnrol.textContent = rol.replace(/_/g, ' ');
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
      qnaddproduct()
    }
  }

  await loadTranslations();

  const quotationDownload = quotationNew.querySelector('.quotation--download')
  if (quotationDownload) {
    quotationDownload.setAttribute('href', `/api/Quotation/pdf/${cotId}`);
  }
  const quotationEmail = quotationNew.querySelector('.quotation--email')
  if (quotationEmail) {
    quotationEmail.setAttribute('href', `/api/Quotation/email/${cotId}`);
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

  const quotationBtnSave = quotationNew.querySelector('#quotation--btn__save')

  if(cotId && cotName) {
    quotationBtnSave.textContent = await getTranslation("save_scenario")
  }
  else {
    quotationBtnSave.textContent = await getTranslation("save_quotation")
  }

  const quotatioewScenary = quotationNew.querySelector('#quotationewscenary')
  const quotatioewScenaryNode = quotatioewScenary ? quotatioewScenary.value : false
  const idQuotationComments = quotationNew.querySelector('#quotationcomments')
  const quotatioNewClient = quotationNew.querySelector('#quotationewclient')

  const quotationewInfoOne = quotationNew.querySelector('.quotationew__infoOne .error-input-name')
  const quotatioewScenaryError = quotationNew.querySelector('#quotationewscenary + .error-input')
  const quotationewSearchClient = quotationNew.querySelector('.quotationew__searchclient .error-input')

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

  const quotationIva = quotationNew.querySelector('.quotation--iva')
  const ClientFullName = expiringLocalStorage.getDataWithExpiration('ClientFullName')
  
  if(resQueryUser.rol === "advisors") {
    quotationIva.disabled = false
  } else {
    quotationIva.disabled = true
  }
  if(resQueryUser.currency === "COP") {
    quotationIva.checked = true
  } else {
    quotationIva.checked = false
  }
  if (ClientFullName) {
    const client = JSON.parse(ClientFullName)
    if(client.length > 0){
      if(client[0].currency === "COP") {
        quotationIva.checked = true
      } else {
        quotationIva.checked = false
      }
    }
  }

  quotationBtnSave.addEventListener('click', async () => {
    quotationBtnSave.disabled = true

    const btnSave = async () => {
      const quotationCalculation = new QuotationCalculation(resQueryUser);

      if (resQueryUser.rol !== 'advisors') {
        if (quotationewname) {
          if (quotationewname.value == '') {
            quotationewname.classList.add('error')

            nodeNotification(await getTranslation("fields_marked_mandatory"))
            setTimeout(() => {
              quotationBtnSave.disabled = false
            }, 2000);

            return;
          }
        }
      } else {
        if (quotationewname && quotatioNewClient) {
          if (quotationewname.value === '' || quotatioNewClient.value === '') {
            if (quotationewname.value === '') {
              quotationewInfoOne.classList.remove('quotation-hide')
              quotationewname.classList.add('error');
            } else {
              quotationewInfoOne.classList.add('quotation-hide')
            }

            if (quotatioNewClient.value === '') {
              quotationewSearchClient.classList.remove('quotation-hide')
              quotatioNewClient.classList.add('error');
            } else {
              quotationewSearchClient.classList.add('quotation-hide')
            }

            nodeNotification(await getTranslation("fields_marked_mandatory"));
            setTimeout(() => {
              quotationBtnSave.disabled = false
            }, 2000);

            return;
          } else {
            quotationewSearchClient.classList.add('quotation-hide')
            quotationewInfoOne.classList.add('quotation-hide')
            quotationewname.classList.remove('error');
            quotatioNewClient.classList.remove('error');
            expiringLocalStorage.saveDataWithExpiration("NameQuotation", JSON.stringify(quotationewname.value));
          }
        }
      }

      if (cotId && cotName) {
        if (quotatioewScenary) {
          if (quotatioewScenary.value === '') {
            quotatioewScenary.classList.add('error');
            quotatioewScenaryError.classList.remove('quotation-hide')
            nodeNotification(await getTranslation("fields_marked_mandatory"))
            setTimeout(() => {
              quotationBtnSave.disabled = false
            }, 2000);
            return;
          } else {
            quotatioewScenaryError.classList.add('quotation-hide')
            expiringLocalStorage.saveDataWithExpiration("NameScenary", JSON.stringify(quotatioewScenaryNode.value))
          }
          await quotationCalculation.SendNewScenary(resQueryUser, quotationIva.checked, cotId, quotatioewScenary.value)
        }
      } else {
        await quotationCalculation.SendNewQuotation(resQueryUser, quotationIva.checked, quotationewname.value, idQuotationComments.value );
      }
    }
    await btnSave()
  });
}

export default quotationNewPage
