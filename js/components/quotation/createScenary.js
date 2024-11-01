import deleteChilds from "../../helpers/deleChilds.js"
import nodeListPrice from "../../helpers/nodeListPrice.js"
import statusQuotation from "../../helpers/statusQuotation.js"
import sendEmailHelper from "../../helpers/sendEmailHelper.js"
import Login from "../../login/login.js"
import statusQuotationS from "../../services/statusQuotation/statusQuotation.js"
import putQuotationScenario from "../../services/quotation/putQuotationScenario.js"
import { config } from "../../../config.js"
import modalApproval from "../../helpers/modalApproval.js"
import formatCurrency from "../../helpers/formatCurrency.js"
import downloadPdfHelper from "../../helpers/downloadPdfHelper.js"
import { getTranslation, loadTranslations } from "../../lang.js"

const createScenary = (cot, datecreatedAt, dateupdatedAt, cotStatus) => {
  const quotationCreatescenary = quotation.querySelector('#quotation--content--list .quotation--list--row')
  const quotationCreatescenarys = quotation.querySelectorAll('#quotation--content--list .quotation--list--row')
  const scenaryContainerTop = quotation.querySelector('#scenary--container__top')
  const scenaryCreatedBody = quotation.querySelector('#scenary--container__bottom')
  const currentRol = localStorage.getItem('rol')
  const currentRolisAdminSafetti = localStorage.getItem('isAdminSafetti')
  const currentUser = localStorage.getItem('current')
  let lastClickedIndex = localStorage.getItem('lastClickedIndex');
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const token = searchParams.get('token') || '';

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
            <span class="quotation--info quotation--info__bold"><span data-tkey="number"></span> ${cot.id ? cot.id : ''}</span>
            <span class="quotation--status">${cotStatus.statusName}</span>
          </div>
          <div class="region region__two">
            <a class="quotation--email" href="/api/Quotation/email/${currentUser}/${cot.id}">
              <span class="quotation--send--data quotation--info" data-tkey="send_email"></span>
              <img class="quotation--email__img" src='../../img/icon/icon-email.svg' loading="lazy" alt="Email" title="Email">
            </a>
            <a class="quotation--download" href="/api/Quotation/pdf/${cot.id}">
              <span class="quotation--generate--pdf quotation--info" data-tkey="generate_pdf"></span>
              <img class="quotation--download__img" src='../../img/icon/icon-download.svg' loading="lazy" alt="Descargar" data-tkey="download" data-tattr="title" title="">
            </a>
          </div>
        </section>
        <section class="scenary--two">
          <span class="quotation--info"><span data-tkey="creation"></span>: ${datecreatedAt}</span>
          <span class="quotation--info"><span data-tkey="last_update"></span>: ${dateupdatedAt}</span>
        </section>
        <section class="scenary--three">
          <h3 class="quotation--title">${cot.name ? cot.name : ''}</h3>
        </section>
        <section class="scenary--four">
          <span class="quotation--info"><span data-tkey="client"></span>: ${cot.clientName ? cot.clientName : ''}</span>
          <span class="quotation--info"><span data-tkey="advisor"></span>: ${cot.advisorName ? cot.advisorName : ''}</span>
          <span class="quotation--info"><span data-tkey="currency"></span>: ${cot.currency ? cot.currency : ''}</span>
        </section>
        <section class="scenary--five">
          <div class="scenary--data">
            <div class="scenary--data__header selected">
              <h4 class="quotation--title__quo" data-tkey="selected_scenario"></h4>
            </div>
            <div class="scenary--data__body">
              <div class="quotation--notification"><span class="quotation--title" data-tkey="no_scenarios"></span></div>
            </div>
            <div class="scenary--data__actions">
              <a href="./index-q.html?cotId=${cot.id}&cotName=${encodeURIComponent(cot.name)}&uid=${storedHash}&token=${token}" class="quotation--btn__add quotation--btn__Ne" data-tkey="new_scenario"></a>
              <a id="quotation--btn__approved-tmp" class="quotation--btn__modal scenary--data__actionsDelete ${cotStatus.statusId==1?'':'d-none'}" href="#" data-cotid="${cot.id}">
                <span class="quotation--info" data-tkey="send_for_approval"></span>
                <img src='../../img/icon/icon-send.png' loading="lazy" alt="Aprobar" data-tkey="approve" data-tattr="title" title="">
              </a>
              <a id="quotation--btn__approved-tmp" class="quotation--btn__file scenary--data__actionsDelete  ${cotStatus.statusId==5?'':'d-none'}" href="#" data-cotid="${cot.id}">
                <span class="quotation--info" data-tkey="load_payment_support"></span>
                <img src='../../img/icon/icon-validate.png' loading="lazy" alt="Aprobar" data-tkey="approve" data-tattr="title" title="">
              </a>
              <a id="quotation--btn__approved-tmp" class="quotation--btn__file-approve scenary--data__actionsDelete ${cotStatus.statusId==5?'':'d-none'}" href="#" data-cotid="${cot.id}" data-url="${cot.paymentSupportFilePath}" data-ispdf="${cot.isPaymentSupportPDF}">
                <span class="quotation--info" data-tkey="validate_payment_support"></span>
                <img src='../../img/icon/icon-validate.png' loading="lazy" alt="Aprobar" data-tkey="approve" data-tattr="title" title="">
              </a>
              <div id="quotation--btn__delete" class="scenary--data__actionsDelete">
                <span class="quotation--info" data-tkey="cancel_quotation"></span>
                <img src='../../img/icon/icon-delete.svg' loading="lazy" alt="Cancelar" data-tkey="cancel" data-tattr="title" title="">
              </div>
            </div>
          </div>
        </section>
        ${
          (cot.id && cotStatus.statusId === 2) ?  
          `<div class="scenary--data__actions">
            <a href="${config.API_DEV_IMAGE}/proyecto/${cot.id}" target="_top" class="quotation--btn__add" data-tkey="see_project"></a>
          </div>`: ``} 
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
    if(cot.paymentSupportFilePath && currentRol != 'advisors' ) {
      const quotationBtnFileApprove = quotation.querySelector(".quotation--btn__file-approve")
      if(quotationBtnFileApprove) {
        quotationBtnFileApprove.remove()
      }
    }

    if(cot.status.id === 5 && cot.paymentSupportFilePath && currentRol != "advisors") {
      const quotationBtnApproved = quotation.querySelector('.scenary--data__actions');
      if(quotationBtnApproved) {
        const messageHtml = '<p class="text-help">Tu soporte está en revisión</p>';
        quotationBtnApproved.insertAdjacentHTML('beforeend', messageHtml);
      }
    }
    if(cot.paymentSupportFilePath == null && currentRol == "advisors") {
      const quotationBtnFileApprove = quotation.querySelector(".quotation--btn__file-approve")
      if(quotationBtnFileApprove) {
        quotationBtnFileApprove.remove()
      }
    }
    
    if(cot.paymentSupportFilePath) {
      const quotationBtnFile = quotation.querySelector('.quotation--btn__file')
      if(quotationBtnFile) {
        quotationBtnFile.remove()
      }
    }

    if(currentRol !== 'advisors' && quotationBtnNe) {
      const quotationBtnDelete = quotation.querySelector('#quotation--btn__delete')
      if(quotationBtnDelete) {
        quotationBtnDelete.remove()
      }
      quotationBtnNe.remove()
    }
      
    if(currentRol != 'advisors') {
      const quotationBtnFileApprove = quotation.querySelector(".quotation--btn__file-approve")
      if(quotationBtnFileApprove) {
        quotationBtnFileApprove.remove()
      }
      const quotationBtnModal = quotation.querySelector('.quotation--btn__modal')
      if(quotationBtnModal) {
        quotationBtnModal.remove()
      }
    }
    
    // Send Email
    const quotationEmail = quotation.querySelector('.quotation--email')
    const quotationSendData = quotation.querySelector('.quotation--send--data')
    sendEmailHelper(quotationEmail, quotationSendData)

    //const quotationDownload = quotation.querySelector('.quotation--download')
    //const quotationGeneratePdf = quotation.querySelector('.quotation--generate--pdf')
    //downloadPdfHelper(quotationDownload, quotationGeneratePdf)

    // Delete Scenary Top
    const uid = localStorage.getItem('current')
    quotationBtnDelete.addEventListener('click', () => {
      statusQuotationS(cot.id, 3, uid)
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

    const getScenary = () => {
      if(cot.scenarios.length > 0) {
        const scenaryData = quotation.querySelector('.scenary--data__body .quotation--notification')
        if (scenaryData) {
          scenaryData.remove()
        }
      }
      const sortedIndices = Object.keys(cot.scenarios).sort((a, b) => b - a);
      sortedIndices.forEach(async i => {
        const scen = cot.scenarios[i];

        let totalProducts = 0;
        scen.products.forEach(product => {
          if (typeof product.unitPrice === 'number' && product.unitPrice !== '') {
            totalProducts += product.unitPrice;
          }
        });

        const subtotalProductsSeleccionado = cot.scenarios.find(x => x.selected).subtotalProducts;
        const esRolEditable = (currentRol && currentRol === 'advisors') || (currentRol && currentRol === 'administrator') || (currentRolisAdminSafetti && currentRolisAdminSafetti === 'true');

        // Scenary selected 
        if ( scen.selected === true ) {
          const scenaryDataBody = quotation.querySelector('.scenary--data__body')
          const count =  parseInt(i) + 1
          let scenaryBody =
          `<div class="scenary--data__scenary">
            <table>
              <tr>
                <td><span class="quotation--title__quo">#${count} - ${scen.name ? scen.name : ''}</span></td>
                <td><span class="quotation--title__quo" data-tkey="subtotal"></span></td>
                <td><span class="quotation--title__quo" data-tkey="product_costs"></span></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td><p class="quotation--info">$ ${formatCurrency(subtotalProductsSeleccionado, cot.currency)}</p></td>
                <td><p class="quotation--info">$ ${formatCurrency(scen.total, cot.currency)} </p></td>
                <td>
                <span class="quotation--btn__view">
                  <a class="quotation--info quotation--detail" href="${
                    esRolEditable && cot.statusId === 1
                      ? `./index-q.html?uid=${storedHash}&clone=true&scenaryId=${scen.id}&cotId=${cot.id}&cotName=${cot.name}&token=${token}`
                      : `./cotizacion.html?id=${cot.id}&uid=${storedHash}&token=${token}`}">
                    ${esRolEditable && cot.statusId === 1 ? await getTranslation("edit") : await getTranslation("see_detail")}
                  </a>
                </span>
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

        scen.products.forEach(product => {
          productName.push(product.productName)
          linePrice.push("$ " + formatCurrency(product.linePrice, cot.currency))
          unitPrice.push("$ " + formatCurrency(product.unitPrice, cot.currency))
        });
        const count =  parseInt(i) + 1
        let scenaryList = 
        `<div class="scenary--created__body">
          <div class="scenary--data__body">
            ${scen.selected === true ? '<div class="scenary--data__scenary selected">' : '<div class="scenary--data__scenary">'}
              ${scen.selected === true ? '<div class="scenary--row__header selected">' : '<div class="scenary--row__header">'}
                <span class="quotation--title__quo">#${count} - ${scen.name ? scen.name : ''}</span>
                <div class="scenary--row__actions">
                  <a id="email-${i}" class="scenary--quotation--email" href="/api/Quotation/emailscenario/${cot.client}/${scen.id}">
                    <span class="scenary--quotation--send--data quotation--info" data-tkey="send_email"></span>
                    <img class="quotation--email__img" src='${scen.selected === true ? '../../img/icon/icon-email.svg' : '../../img/icon/icon-email-white.svg'}' loading="lazy" alt="Email" title="Email">
                  </a>
                  <a class="quotation--download" href="/api/Quotation/scenariopdf/${scen.id}">
                    <span class="quotation--generate--pdf quotation--info" data-tkey="generate_pdf"></span>
                    <img class="quotation--download__img" src='${scen.selected === true ? '../../img/icon/icon-download.svg' : '../../img/icon/icon-download-white.svg'}' loading="lazy" alt="Descargar" data-tkey="download" data-tattr="title" title="">
                  </a>
                </div>  
                <div class="scenary--row__select ${cotStatus.statusId === 4 /*Por Confirmar*/ ||  cotStatus.statusId === 5 /*Validar Anticipo*/ ? 'd-none' : ''}">
                  <span class="quotation--info" data-tkey="select"></span>
                  <img src="../../img/icon/check.svg" loading="lazy" alt="Seleccionar" data-tkey="select" data-attr="title" title="">
                </div>
              </div>

              <div class="scenary--row__body">
                <div class="scenary--row__table">
                  <table>
                    <tr>
                      <td><span class="quotation--title__quo" data-tkey="product"></span></td>
                      <td><span class="quotation--title__quo" data-tkey="base_price"></span></td>
                      <td><span class="quotation--title__quo" data-tkey="product_costs"></span></td>
                    </tr>
                    <tr>
                      <td><div id="products"></div></td>
                      <td><div id="unitPrices"></div></td>
                      <td><div id="prices"></div></td>
                    </tr>
                    <tr>
                      <td><span class="quotation--title__quo" data-tkey="total"></span></td>
                      <td></td>
                      <td><p class="quotation--title__quo">$ ${formatCurrency(scen.total, cot.currency)}</p></td>
                    </tr>
                  </table>
                </div>  
              </div>
            </div>
          </div>
        </div>`

        scenaryContainerBottom.insertAdjacentHTML('afterbegin', `${scenaryList}`)
        loadTranslations();
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
        nodeListPrice(productName, idProducts)
        nodeListPrice(unitPrice, idUnitPrices)
        nodeListPrice(linePrice, idPrices)
        //const scenaryCreatedBody = quotation.querySelector('.scenary--created__body')
      });
      modalApproval(quotation, "#modal-approval", ".quotation--btn__modal")
      modalApproval(quotation, "#modal-file", ".quotation--btn__file")
      modalApproval(quotation, "#modal-approve-support", ".quotation--btn__file-approve")
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

    const generatePdfNodes = () => {
      const quotationDownloadList = quotation.querySelectorAll('.quotation--download')
      quotationDownloadList.forEach(link => {
        const quotationGeneratePdf = link.querySelector('.quotation--generate--pdf')
        downloadPdfHelper(link, quotationGeneratePdf)
      });
    }

    generatePdfNodes()
  })
}

export default createScenary