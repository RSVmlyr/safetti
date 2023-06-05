import dateFormat from "../helpers/dateFormat.js"
import statusQuotation from "../helpers/statusQuotation.js"
import createScenary from "./createScenary.js"

const quotationContentList = quotation.querySelector('#quotation--content--list')

const quotationListRow = (cot) => {

  // Status quotation
  const cotStatus = {
    statusId : cot.status.id ? cot.status.id : '',
    statusName : cot.status.name ? cot.status.name : ''
  }
  // Status quotation

  const datecreatedAt = dateFormat(cot.createdAt)
  const dateupdatedAt = dateFormat(cot.updatedAt)

  let quotationListRow =
  `<div class="quotation--list--row">
    <div class="quotation--list--one">
      <div class="region region__left">
        <span class="quotation--data">Fecha de creación: ${datecreatedAt}</span>
      </div>
      <div class="region region__right">
       <div class="quotation--origin">
        <img class="quotation--origin__shopify quotation-hide" src='../../img/icon/icon-shopify.svg' loading="lazy" alt="Shopify" title="Shopify">
       </div>
       <div class="quotation--origin__data">
        <span class="quotation--info">Código ${cot.id ? cot.id : ''}</span>
        <span class="quotation--status quotation--info__bold">${cotStatus.statusName}</span>
       </div>
      </div>
    </div>
    <div class="quotation--list--two">
      <h3 class="quotation--title">${cot.name ? cot.name : ''}</h3>
    </div>
    <div class="quotation--list--three">
      <div class="region region__one">
        <span class="quotation--info">Ciente: ${cot.clientName ? cot.clientName : ''}</span>
      </div>
      <div class="region region__two">
        <span class="quotation--info">Asesor: ${cot.advisorName ? cot.advisorName : ''}</span>
      </div>
      <div class="region region__three">
        <div class="quotation--create--scenary quotation--arrow__right">-></div>
      </div>
    </div>
  </div>`

  quotationContentList.insertAdjacentHTML('afterbegin', `${quotationListRow}`)

  // Origin quotation spotify
  const quotationOrigin = quotation.querySelector('.quotation--origin__shopify')
  if (cot.fromShopify === true) {
    quotationOrigin.classList.remove('quotation-hide')
  } else if (cot.fromShopify === null || cot.fromShopify === undefined || cot.fromShopify === '') {
    return false
  }
  // Origin quotation spotify

  // Status quotation
  const quotationStatus = quotation.querySelector('.quotation--status')
  statusQuotation(cotStatus.statusId, quotationStatus)
  // Status quotation
  
  createScenary(cot, datecreatedAt, dateupdatedAt, cotStatus)

}

export default quotationListRow