import deleteChilds from "../../helpers/deleChilds.js"
import nodeListPrice from "../../helpers/nodeListPrice.js"
import statusQuotation from "../../helpers/statusQuotation.js"
import deleteScenary from "./deleteSecenary.js"
import sendEmailHelper from "../../helpers/sendEmailHelper.js"
import Login from "../../login/login.js"
import statusQuotationS from "../../services/statusQuotation/statusQuotation.js"
import quotationNewPage from "../quotationNew/quotationNew.js"
import getUser from "../../services/user/getUser.js"
import putQuotationScenario from "../../services/quotation/putQuotationScenario.js"
import currencyFormatUSD from "../../helpers/currencyFormatUSD.js"
import { config } from "../../../config.js"
import modalApproval from "../../helpers/modalApproval.js"

const createScenary = (cot, datecreatedAt, dateupdatedAt, cotStatus) => {
  const API_DEV = config.API_KEY_DEV;
  const quotationCreatescenary = quotation.querySelector('#quotation--content--list .quotation--list--row')
  const quotationCreatescenarys = quotation.querySelectorAll('#quotation--content--list .quotation--list--row')
  const scenaryContainerTop = quotation.querySelector('#scenary--container__top')
  const scenaryCreatedBody = quotation.querySelector('#scenary--container__bottom')
  const currentRol = localStorage.getItem('rol')
  const currentUser = localStorage.getItem('current')
  let lastClickedIndex = localStorage.getItem('lastClickedIndex');

  quotationCreatescenarys.forEach((other, index) => {
    other.classList.remove('active');
    if (lastClickedIndex !== null && index.toString() === lastClickedIndex) {
      other.classList.add('active');
      setTimeout(() => {
        other.click()
      }, 100);
    }
  });
  
  quotationCreatescenarys.forEach((q, index) => {
    q.addEventListener('click', () => {
      quotationCreatescenarys.forEach((other) => {
        other.classList.remove('active');
      });
      q.classList.add('active');
      q.click()
      lastClickedIndex = index.toString();
      localStorage.setItem('lastClickedIndex', lastClickedIndex);
    });
  });

  quotationCreatescenary.addEventListener('click', (e) => {

    const quotationLoading = quotation.querySelector('.quotation--container__bottom  .quotation--right .quotation--loading')
    if (quotationLoading) {
      quotationLoading.remove()
    }
    deleteChilds(scenaryContainerTop)
    deleteChilds(scenaryCreatedBody)

    const login = new Login();
    const storedHash = login.getStoredHash();
    let scenaryTop =
    `<div class="scenary--created">
      <div class="scenary--created__header">
        <section class="scenary--one">
          <div class="region region__one">
            <img class="quotation--origin__shopify quotation-hide" src='../../img/icon/icon-shopify.svg' loading="lazy" alt="Shopify" title="Shopify">
            <span class="quotation--info quotation--info__bold">Nro. ${cot.id ? cot.id : ''}</span>
            <span class="quotation--status">${cotStatus.statusName}</span>
          </div>
          <div class="region region__two">
            <a class="quotation--email" href="${API_DEV}/api/Quotation/email/${currentUser}/${cot.id}">
              <span class="quotation--send--data quotation--info">Enviar correo</span>
              <img class="quotation--email__img" src='../../img/icon/icon-email.svg' loading="lazy" alt="Email" title="Email">
            </a>
            <a class="quotation--download" href="${API_DEV}/api/Quotation/pdf/${cot.id}">
              <span class="quotation--info">Generar PDF</span>
              <img class="quotation--download__img" src='../../img/icon/icon-download.svg' loading="lazy" alt="Descargar" title="Descargar">
            </a>
          </div>
        </section>
        <section class="scenary--two">
          <span class="quotation--info">Creación: ${datecreatedAt}</span>
          <span class="quotation--info">Última modificación: ${dateupdatedAt}</span>
        </section>
        <section class="scenary--three">
          <h3 class="quotation--title">${cot.name ? cot.name : ''}</h3>
        </section>
        <section class="scenary--four">
          <span class="quotation--info">Ciente: ${cot.clientName ? cot.clientName : ''}</span>
          <span class="quotation--info">Asesor: ${cot.advisorName ? cot.advisorName : ''}</span>
          <span class="quotation--info">Moneda: ${cot.currency ? cot.currency : ''}</span>
        </section>
        <section class="scenary--five">
          <div class="scenary--data">
            <div class="scenary--data__header selected">
              <h4 class="quotation--title__quo">Escenario seleccionado</h4>
            </div>
            <div class="scenary--data__body">
              <div class="quotation--notification"><span class="quotation--title">No existen escenarios.</span></div>
            </div>
            <div class="scenary--data__actions">
              <a href="./index-q.html?cotId=${cot.id}&cotName=${encodeURIComponent(cot.name)}&uid=${storedHash}" class="quotation--btn__add quotation--btn__Ne">Nuevo escenario</a>
              <a id="quotation--btn__approved-tmp" class="quotation--btn__modal scenary--data__actionsDelete" href="#" data-cotid="${cot.id}">
                <span class="quotation--info">Enviar para aprobación</span>
                <img src='../../img/icon/check.svg' loading="lazy" alt="Aprobar" title="Aprobar">
              </a>
              <a id="quotation--btn__approved-tmp" class="quotation--btn__file scenary--data__actionsDelete" href="#">
                <span class="quotation--info">Validar Anticipo</span>
                <img src='../../img/icon/check.svg' loading="lazy" alt="Aprobar" title="Aprobar">
              </a>
              <div id="quotation--btn__delete" class="scenary--data__actionsDelete">
                <span class="quotation--info">Cancelar cotización</span>
                <img src='../../img/icon/icon-delete.svg' loading="lazy" alt="Eliminar" title="Eliminar">
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    `

    scenaryContainerTop.insertAdjacentHTML('afterbegin', `${scenaryTop}`)
    // Origin quotation shopify
    const quotationOriginScenary = quotation.querySelector('.scenary--created .quotation--origin__shopify')
    if (cot.fromShopify === true) {
      quotationOriginScenary.classList.remove('quotation-hide')
    } else if (cot.fromShopify === null || cot.fromShopify === undefined || cot.fromShopify === '') {
      return false
    }
    // Origin quotation shopify

    // Status quotation
      const quotationStatusScenary = quotation.querySelector('.scenary--created .quotation--status')
      statusQuotation(cotStatus.statusId, quotationStatusScenary)
    // Status quotation

    const scenaryCreated = quotation.querySelector('.scenary--created')
    const quotationBtnDelete = quotation.querySelector('#quotation--btn__delete')
    const quotationBtnApproved = quotation.querySelector('#quotation--btn__approved')
    const quotationContainer = quotation.querySelector('.scenary--data__actions')
    
    if (cot.status.id === 2 ) {
      quotationContainer.remove()
    }

    const quotationBtnNe = quotation.querySelector('.quotation--btn__Ne')
    if (cotStatus.statusId === 3 && scenaryCreated) {
      quotationContainer.remove()
    }

    if(currentRol !== 'advisors' && quotationBtnNe) {
      const scenaryDataActions = quotation.querySelector('.scenary--data__actions')
      scenaryDataActions.remove()
      quotationBtnNe.remove()
    }

    // Send Email
    const quotationEmail = quotation.querySelector('.quotation--email')
    const quotationSendData = quotation.querySelector('.quotation--send--data')
    sendEmailHelper(quotationEmail, quotationSendData)
    // Send Email

    // Delete Scenary Top
    quotationBtnDelete.addEventListener('click', () => {
      statusQuotationS(cot.id, 3)
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    const userId = localStorage.getItem("current")
    if(quotationBtnApproved) {
      quotationBtnApproved.addEventListener('click', () => {
        statusQuotationS(cot.id, 2, userId)
        setTimeout(() => {
          location.reload();
        }, 1000);
      })  
    }

    // deleteScenary(quotationBtnDelete, scenaryCreated)
    // Delete Scenary Top

    const getScenary = () => {
      if(cot.scenarios.length > 0) {
        const scenaryData = quotation.querySelector('.scenary--data__body .quotation--notification')
        if (scenaryData) {
          scenaryData.remove()
        }
      }
      const sortedIndices = Object.keys(cot.scenarios).sort((a, b) => b - a);
      sortedIndices.forEach(i => {
        const scen = cot.scenarios[i];
        let totalProducts = 0;
        scen.products.forEach(product => {
          if (typeof product.unitPrice === 'number' && product.unitPrice !== '') {
            totalProducts += product.unitPrice;
          }
        });
        let totalPro = totalProducts

        const totalpValue = currencyFormatUSD(totalPro, scen.currency) 
        const totalValue = currencyFormatUSD(scen.total, scen.currency)

        // Scenary selected 
        if ( scen.selected === true ) {
          const scenaryDataBody = quotation.querySelector('.scenary--data__body')
          const count =  parseInt(i) + 1
          let scenaryBody =
          `<div class="scenary--data__scenary">
            <table>
              <tr>
                <td><span class="quotation--title__quo">#${count} - ${scen.name ? scen.name : ''}</span></td>
                <td><span class="quotation--title__quo">Precio Base</span></td>
                <td><span class="quotation--title__quo">Costo Productos</span></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td><p class="quotation--info">$ ${cot.currency === 'COP' ? totalPro.toLocaleString() : totalpValue}</p></td>
                <td><p class="quotation--info">$ ${cot.currency === 'COP' ? scen.total.toLocaleString() : totalValue}</p></td>
                <td><span class="quotation--btn__view"><a  class="quotation--info quotation--detail" href="./Cotizacion.html?id=${cot.id}&uid=${storedHash}">Ver detalle</a></span></td>
              </tr>
            </table>
          </div>
          `
          scenaryDataBody.insertAdjacentHTML('afterbegin', `${scenaryBody}`)
        }
        // Scenary selected

        // Scenary List
        const scenaryContainerBottom = quotation.querySelector('#scenary--container__bottom')

        let productName = []
        let linePrice = []
        let unitPrice = []
        let scenSelected

        scen.products.forEach(product => {
          scenSelected = scen.selected
          productName.push(product.productName)
          linePrice.push(product.linePrice)
          unitPrice.push(product.unitPrice)
        });
        const count =  parseInt(i) + 1
        let scenaryList = 
        `<div class="scenary--created__body">
          <div class="scenary--data__body">
            ${scen.selected === true ? '<div class="scenary--data__scenary selected">' : '<div class="scenary--data__scenary">'}
              ${scen.selected === true ? '<div class="scenary--row__header selected">' : '<div class="scenary--row__header">'}
                <span class="quotation--title__quo">#${count} - ${scen.name ? scen.name : ''}</span>
                <div class="scenary--row__actions">
                  <a id="email-${i}" class="scenary--quotation--email" href="${API_DEV}/api/Quotation/emailscenario/${cot.client}/${scen.id}">
                    <span class="scenary--quotation--send--data quotation--info">Enviar correo</span>
                    <img class="quotation--email__img" src='${scen.selected === true ? '../../img/icon/icon-email.svg' : '../../img/icon/icon-email-white.svg'}' loading="lazy" alt="Email" title="Email">
                  </a>
                  <a class="quotation--download" href="${API_DEV}/api/Quotation/scenariopdf/${scen.id}">
                    <span class="quotation--info">Generar PDF</span>
                    <img class="quotation--download__img" src='${scen.selected === true ? '../../img/icon/icon-download.svg' : '../../img/icon/icon-download-white.svg'}' loading="lazy" alt="Descargar" title="Descargar">
                  </a>
                </div>  
                <div class="scenary--row__select">
                  <span class="quotation--info">Seleccionar</span>
                  <img src="../../img/icon/check.svg" loading="lazy" alt="Seleccionar" title="Seleccionar">
                </div>
              </div>

              <div class="scenary--row__body">
                <div class="scenary--row__table">
                  <table>
                    <tr>
                      <td><span class="quotation--title__quo">Producto</span></td>
                      <td><span class="quotation--title__quo">Precio Base</span></td>
                      <td><span class="quotation--title__quo">Costo Productos</span></td>
                    </tr>
                    <tr>
                      <td><div id="products"></div></td>
                      <td><div id="unitPrices"></div></td>
                      <td><div id="prices"></div></td>
                    </tr>
                    <tr>
                      <td><span class="quotation--title__quo">Total</span></td>
                      <td></td>
                      <td><p class="quotation--title__quo">$ ${cot.currency === 'COP' ? scen.total.toLocaleString() : totalValue}</p></td>
                    </tr>
                  </table>
                </div>  
              </div>
            </div>
          </div>
        </div>`
        
        scenaryContainerBottom.insertAdjacentHTML('afterbegin', `${scenaryList}`)
        const scenaryRowSelect = quotation.querySelector('.scenary--row__select')
        if(currentRol !== 'advisors' || scen.selected) {
          scenaryRowSelect.remove()
        }
        if (scenaryRowSelect) {
          scenaryRowSelect.addEventListener('click', (e) => {
            putQuotationScenario(scen.id)
          })
        }

        if (cotStatus.statusId === 2 || cotStatus.statusId === 3 && scenaryCreated) {
          scenaryRowSelect.remove() 
        }

        const idProducts = quotation.querySelector('#products');
        const idPrices = quotation.querySelector('#prices');
        const idUnitPrices = quotation.querySelector('#unitPrices');

        // Create data for scenary
        nodeListPrice(productName, idProducts)
        nodeListPrice(unitPrice, idUnitPrices)
        nodeListPrice(linePrice, idPrices)
        // Create data for scenary

        // Delete Scenary Bottom
        const scenaryCreatedBody = quotation.querySelector('.scenary--created__body')
        // deleteScenary(quotationBtnDelete, scenaryCreatedBody)
        // Delete Scenary Bottom

        // Scenary List

      });
      modalApproval(quotation, "#modal-approval", ".quotation--btn__modal")
      modalApproval(quotation, "#modal-file", ".quotation--btn__file")
    }

    getScenary()

    const emailSendNodes = () => {
      const idEmail = quotation.querySelectorAll('.scenary--quotation--email')
      idEmail.forEach(email => {
        const scenaryQuotationSendData = email.querySelector('.scenary--quotation--send--data')
          sendEmailHelper(email, scenaryQuotationSendData)
      });
    }

    emailSendNodes()

  })
}

export default createScenary