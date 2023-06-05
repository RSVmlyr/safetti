import deleteChilds from "../helpers/deleChilds.js"
import nodeList from "../helpers/nodeList.js"
import statusQuotation from "../helpers/statusQuotation.js"

const createScenary = (cot, datecreatedAt, dateupdatedAt, cotStatus) => {

    const quotationCreatescenary = quotation.querySelector('#quotation--content--list .quotation--list--row')
    const scenaryContainerTop = quotation.querySelector('#scenary--container__top')

    quotationCreatescenary.addEventListener('click', (e) => {

      const quotationLoading = quotation.querySelector('.quotation--container__bottom  .quotation--right .quotation--loading')
      if (quotationLoading) {
        quotationLoading.remove()
      }

      const scenaryCreatedBody = quotation.querySelector('#scenary--container__bottom')

      deleteChilds(scenaryCreatedBody)

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
              <span class="quotation--info">Enviar correo</span>
              <span class="quotation--info">Generar PDF</span>
              <span class="quotation--info quotation--download">Download</span>
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
              <div class="scenary--data__header">
                <h4 class="quotation--title">Escenario seleccionado</h4>
              </div>
              <div class="scenary--data__body">
                <div class="quotation--notification"><span>No existen escenarios.</span></div>
              </div>
              <div class="scenary--data__actions">
                <button class="quotation--btn__new">Nuevo escenario</button>
                <span class="quotation--btn__delete">Eliminar cotización</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      `
      scenaryContainerTop.insertAdjacentHTML('afterbegin', `${scenaryTop}`)

      const scenaryHeader = quotation.querySelectorAll('.scenary--created')
      const nodossH = Array.from(scenaryHeader);

      nodossH.forEach((sH, indice) => {
        if (indice > 0) {
          sH.remove();
        }
      });

      // Origin quotation spotify
      const quotationOriginScenary = quotation.querySelector('.scenary--created .quotation--origin__shopify')
      if (cot.fromShopify === true) {
        quotationOriginScenary.classList.remove('quotation-hide')
      } else if (cot.fromShopify === null || cot.fromShopify === undefined || cot.fromShopify === '') {
        return false
      }
      // Origin quotation spotify

      // Status quotation
        const quotationStatusScenary = quotation.querySelector('.scenary--created .quotation--status')
        statusQuotation(cotStatus.statusId, quotationStatusScenary)
      // Status quotation

      const getScenary = () => {

        if(cot.scenarios.length > 0) {
          const scenaryData = quotation.querySelector('.scenary--data__body .quotation--notification')
          if (scenaryData) {
            scenaryData.remove()
          }
        }
        cot.scenarios.forEach(scen => {

          // Total products unit price
          let totalProducts = 0

          scen.products.forEach(product => {
            // console.log('--------------');
            // console.log(product.productName);
            // console.log('Unitario', product.unitPrice);
            // console.log('--------------');
            totalProducts += product.unitPrice ? product.unitPrice : '';
          });
          // console.log('Total', totalProducts.toFixed(2));
          let totalPro = totalProducts.toFixed(2)
          // Total products unit price

          // Scenary selected 
          if ( scen.selected === true ) {

            const scenaryDataBody = quotation.querySelector('.scenary--data__body')

            let scenaryBody =
            `<div class="scenary--data__scenary">
              <div class="scenary--row">
                <span class="quotation--title">${scen.name ? scen.name : ''}</span>
              </div>
              <div class="scenary--row">
                <span class="quotation--title">Productos</span>
                <p class="quotation--text">${totalPro}</p>
              </div>
              <div class="scenary--row">
                <span class="quotation--title">Total</span>
                <p class="quotation--text">${scen.total ? scen.total : ''}</p>
              </div>
              <div class="scenary--row">
                <div class="scenary--cta">
                  <span class="quotation--btn__view">Ver detalle</span>
                </div>
              </div>
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
            linePrice.push(product.linePrice)
            unitPrice.push(product.unitPrice)
          });

          let scenaryList = 
          `<div class="scenary--created__body">
            <div class="scenary--data__body">
              <div class="scenary--data__scenary">
                <div class="scenary--row__header">
                  <span class="quotation--title">${scen.name ? scen.name : ''}</span>
                  <span class="quotation--btn__view">Ver detalle</span>
                </div>
                <div class="scenary--row__body">
                  <div class="scenary--row__table">
                    <div class="scenary--row">
                      <span class="quotation--title">Producto</span>
                      <div id="products"></div>
                    </div>
                    <div class="scenary--row">
                      <span class="quotation--title">linePrice</span>
                      <div id="prices"></div>
                    </div>
                    <div class="scenary--row">
                      <span class="quotation--title">unitPrice</span>
                      <div id="unitPrices"></div>
                    </div>
                    <div class="scenary--row">
                      <span class="quotation--title">Precio Total</span>
                      <p class="quotation--text">587.6815</p>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>`

          scenaryContainerBottom.insertAdjacentHTML('afterbegin', `${scenaryList}`)

          const idProducts = quotation.querySelector('#products');
          const idPrices = quotation.querySelector('#prices');
          const idUnitPrices = quotation.querySelector('#unitPrices');

          nodeList(productName, idProducts)
          nodeList(linePrice, idPrices)
          nodeList(unitPrice, idUnitPrices)

          // Scenary List

        });
        
      }

      getScenary()

    })

  }

  export default createScenary