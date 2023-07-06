import deleteChilds from "../../helpers/deleChilds.js"
import nodeListPrice from "../../helpers/nodeListPrice.js"
import statusQuotation from "../../helpers/statusQuotation.js"
import deleteScenary from "./deleteSecenary.js"
import sendEmailHelper from "../../helpers/sendEmailHelper.js"
import Login from "../../login/login.js"
import statusQuotationCancel from "../../services/statusQuotation/statusQuotation.js"


const createScenary = (cot, datecreatedAt, dateupdatedAt, cotStatus) => {
    const quotationCreatescenary = quotation.querySelector('#quotation--content--list .quotation--list--row')
    const quotationCreatescenarys = quotation.querySelectorAll('#quotation--content--list .quotation--list--row')
    const scenaryContainerTop = quotation.querySelector('#scenary--container__top')
    const scenaryCreatedBody = quotation.querySelector('#scenary--container__bottom')

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
              <span class="quotation--info quotation--info__bold">Código ${cot.id ? cot.id : ''}</span>
              <span class="quotation--status">${cotStatus.statusName}</span>
            </div>
            <div class="region region__two">
              <a class="quotation--email" href="https://safetticustom.azurewebsites.net/api/Quotation/email/${cot.id}">
                <span class="quotation--send--data quotation--info">Enviar correo</span>
                <img class="quotation--email__img" src='../../img/icon/icon-email.svg' loading="lazy" alt="Email" title="Email">
              </a>
              <a class="quotation--download" href="https://safetticustom.azurewebsites.net/api/Quotation/pdf/${cot.id}">
                <span class="quotation--info">Generar PDF</span>
                <img class="quotation--download__img" src='../../img/icon/icon-download.svg' loading="lazy" alt="Descargar" title="Descargar">
              </a>
            </div>
          </section>
          <section class="scenary--two">
            <span class="quotation--info">Creación ${datecreatedAt}</span>
            <span class="quotation--info">Última modificación ${dateupdatedAt}</span>
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
                <a href="./index-q.html?cotId=${cot.id}&cotName=${encodeURIComponent(cot.name)}&uid=${storedHash}" class="quotation--btn__new">Nuevo escenario +</a>
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

      // Send Email
      const quotationEmail = quotation.querySelector('.quotation--email')
      const quotationSendData = quotation.querySelector('.quotation--send--data')
      sendEmailHelper(quotationEmail, quotationSendData)
      // Send Email

      // Delete Scenary Top
      const quotationBtnDelete = quotation.querySelector('#quotation--btn__delete')
      const scenaryCreated = quotation.querySelector('.scenary--created')

      quotationBtnDelete.addEventListener('click', () => {
        statusQuotationCancel(cot.id)
        setTimeout(() => {
          location.reload();
        }, 1000);
      })

      

      // deleteScenary(quotationBtnDelete, scenaryCreated)
      // Delete Scenary Top

      const getScenary = () => {

        if(cot.scenarios.length > 0) {
          const scenaryData = quotation.querySelector('.scenary--data__body .quotation--notification')
          if (scenaryData) {
            scenaryData.remove()
          }
        }
        cot.scenarios.forEach(scen => {

          let totalProducts = 0;
          scen.products.forEach(product => {
            if (typeof product.unitPrice === 'number' && product.unitPrice !== '') {
              totalProducts += product.unitPrice;
            }
          });
          let totalPro = cot.currency === 'COP' ? totalProducts.toLocaleString() : totalProducts.toFixed(2)

          // Scenary selected 
          if ( scen.selected === true ) {
            console.log(scen);
            const scenaryDataBody = quotation.querySelector('.scenary--data__body')
            let scenaryBody =
            `<div class="scenary--data__scenary">
              <table>
                <tr>
                  <td><span class="quotation--title__quo">${scen.name ? scen.name : ''}</span></td>
                  <td><span class="quotation--title__quo">Productos</span></td>
                  <td><span class="quotation--title__quo">Total</span></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td><p class="quotation--info">$ ${totalPro}</p></td>
                  <td><p class="quotation--info">$ ${cot.currency === 'COP' ? scen.total.toLocaleString() : scen.total.toFixed(2)}</p></td>
                  <td><span class="quotation--btn__view"><a href="./Cotizacion.html?id=${cot.id}&uid=${storedHash}">Ver detalle 1</a></span></td>
                </tr>
              </table>
            </div>
            `
            scenaryDataBody.insertAdjacentHTML('afterbegin', `${scenaryBody}`)

            // quotation.addEventListener('DOMContentLoaded', ()=> {
            //   const btnViewQuotation = quotation.querySelector('quotation--btn__view')
            //   console.log(btnViewQuotation);
            // })
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
        
          let scenaryList = 
          `<div class="scenary--created__body">
            <div class="scenary--data__body">
              <div class="scenary--data__scenary">
                ${scenSelected === true ? '<div class="scenary--row__header selected">' : '<div class="scenary--row__header">'}
                  <span class="quotation--title__quo">${scen.name ? scen.name : ''}</span>
                  <span class="quotation--btn__view">Ver detalle</span>
                </div>
                <div class="scenary--row__body">
                  <div class="scenary--row__table">
                    <table>
                      <tr>
                        <td><span class="quotation--title__quo">Producto</span></td>
                        <td><span class="quotation--title__quo">Precio Base</span></td>
                        <td><span class="quotation--title__quo">Precio Total</span></td>
                      </tr>
                      <tr>
                        <td><div id="products"></div></td>
                        <td><div id="unitPrices"></div></td>
                        <td><div id="prices"></div></td>
                      </tr>
                      <tr>
                        <td><span class="quotation--title__quo">Total con IVA</span></td>
                        <td></td>
                        <td><p class="quotation--title__quo">$ ${cot.currency === 'COP' ? scen.total.toLocaleString() : scen.total.toFixed(2)}</p></td>
                      </tr>
                    </table>
                  </div>  
                </div>
              </div>
            </div>
          </div>`

          scenaryContainerBottom.insertAdjacentHTML('afterbegin', `${scenaryList}`)

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
        
      }

      getScenary()

    })

  }

  export default createScenary