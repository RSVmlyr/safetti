import getProductPrices from '../../services/product/getProductPrices.js'
import ExpiringLocalStorage from '../localStore/ExpiringLocalStorage.js'
class QuotationCalculation extends HTMLElement {
  constructor(resQueryUser) {
    super()
    this.sumar()
    this.resQueryUser = resQueryUser
    this.innerHTML = `
      <div class="quotation-calculation">
        <div class="quotationew--calculation__body">
          <div class="scenary--row__table">
            <div class="scenary--row">
              <span class="quotation--title__quo">Producto</span>
              <div id="qnproducts"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Molde</span>
              <div id="unitPrices"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Valor Unitario</span>
              <div id="prices"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Cantidad</span>
              <div id="quantities"></div>
            </div>
            <div class="scenary--row">
              <span class="quotation--title__quo">Subtotal</span>
              <div id="subtotals"></div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  get resQueryUser() {
    return this._resQueryUser
  }

  set resQueryUser(value) {
    this._resQueryUser = value
  }

  getPriceInRange(prices, value) {
    if (prices != undefined) {
      if (value <= 5) {
        return prices["p" + value]
      }

      if (value > 5 && value <= 10) {
        return prices["p10"]
      }

      if (value > 10 && value <= 15) {
        return prices["p15"]
      }

      if (value > 15 && value <= 20) {
        return prices["p20"]
      }

      if (value > 20 && value <= 50) {
        return prices["p50"]
      }

      if (value > 50 && value <= 100) {
        return prices["p100"]
      }

      if (value > 100) {
        return prices["p300"]
      }
    }
  }
  SendNewQuotation(data) {
    if(data) {
      const storedProducts = localStorage.getItem('products')
      const products = storedProducts ? JSON.parse(storedProducts) : []
      const dataSetQuotation = {
        currency: data.currency,
        name: 'Nombre de la Cotización',
        comments: 'string',
        client: data.id,
        clientName: data.fullName,
        advisor: data.advisorId,
        advisorName: data.advisorName,
        scenarios: [
          {
            name: 'Primer Escenario',
            selected: true,
            discountPercent: data.specialDiscount,
            applyTaxIVA: true,
            products: products
          }
        ]
      }
      console.log('body', dataSetQuotation )

    }
  }
  
  createRow(products) { 
    products.forEach(product => {
      const getPrices = async () => {
        const prices = await getProductPrices(
          product.id,
          this.resQueryUser.currency,
          this.resQueryUser.rol
        )
        const priceInRange = this.getPriceInRange(prices, product.quantity)
        let PRange = priceInRange
        let numPrange = PRange.replace(",", ".")
        this.createArrayProducto(product, numPrange)
        this.sumar()
      }
      getPrices()
    })

    const storedProducts = localStorage.getItem('products')
    if(storedProducts) {
      const productsLocalStores = storedProducts ? JSON.parse(storedProducts) : []
      const productsList = JSON.parse(productsLocalStores.value)
      productsList.forEach(product => {
        const subtotal = parseFloat((parseFloat(product.unitPrice) * product.quantity).toFixed(2))
        const row = document.createElement('div')
        row.classList.add('scenary--row__table')
        row.classList.add('scenary--row__data')
        row.innerHTML = `
          <div class="scenary--row">${product.productName}</div>
          <div class="scenary--row">${product.selectedMoldeCode}</div>
          <div class="scenary--row">${product.unitPrice}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">${subtotal}</div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)
      })
    }
    
  }
  createArrayProducto(product, numPrange) {
    this.removeList()
    if(product) {
      const retrievedData = ExpiringLocalStorage.getDataWithExpiration("products")
      let arr = []
      if (retrievedData) {
        const productsLocalStores = retrievedData ? JSON.parse(retrievedData) : []
        arr = productsLocalStores
      }
      console.log('createArrayProducto', arr)
      arr.push({
        product: product.id,
        productName: product.productName,
        selectedMoldeCode: product.selectedMoldeCode,
        quantity: product.quantity,
        unitPrice: numPrange
      })
      ExpiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(arr))
    }
  }

  removeList() {
    console.log('removeList');
    const scenaryTableRow = document.querySelectorAll('.scenary--row__table .scenary--row');
    scenaryTableRow.forEach(e => {
      e.remove();
    });
    return true
  }

  removeItem() {

  }
  async sumar() {
    const subtotalElements = document.querySelectorAll('.subtotal')
    const quotationSave = document.querySelector('.quotation--btn__add')
    let count = 0
    subtotalElements.forEach(element => {
      const valor = parseFloat(element.textContent).toFixed(2)
      count += parseFloat(valor)
    })

    const btniva = document.querySelector('.quotation--iva')
    if (btniva.checked) {
      const iva = count * 0.19
      const quo = document.querySelector('.calculation__dis')
      const dis = count * (parseFloat(quo.textContent).toFixed(2) / 100)
      quotationSave.textContent = ((count + iva) - dis).toFixed(2)
    } else {
      const quo = document.querySelector('.calculation__dis')
      const dis = (count * (parseFloat(quo.textContent).toFixed(2) / 100)).toFixed(2)
      quotationSave.textContent = (count - dis).toFixed(2)
    }
  }

  connectedCallback() {
    //this.SendNewQuotation()
    const btniva = document.querySelector('.quotation--iva')
    const fieldValor = document.querySelector('.quotation--btn__add')
    fieldValor.textContent = 0
    btniva.addEventListener('click', (e) => {
      this.sumar()
    })
    const retrievedData = ExpiringLocalStorage.getDataWithExpiration("products")
    if(retrievedData) {
      const productsList = retrievedData ? JSON.parse(retrievedData) : []
      productsList.forEach(product => {
        const subtotal = parseFloat((parseFloat(product.unitPrice) * product.quantity).toFixed(2))
        const row = document.createElement('div')
        row.classList.add('scenary--row__table')
        row.classList.add('scenary--row__data')
        row.innerHTML = `
          <div class="scenary--row">${product.productName}</div>
          <div class="scenary--row">${product.selectedMoldeCode}</div>
          <div class="scenary--row">${product.unitPrice}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">${subtotal}</div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)
      })
    }
    
  }
}

customElements.define('quotation-calculation', QuotationCalculation)
export default QuotationCalculation
