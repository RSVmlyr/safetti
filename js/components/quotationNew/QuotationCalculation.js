import getProductPrices from '../../services/product/getProductPrices.js'
import setQuotation from '../../services/quotation/setQuotation.js'
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
  SendNewQuotation(data, iva, name, comments ) {
    console.log('data', data, iva, name, comments);
    const comment = comments ? comments : "string"
    let dataSetQuotation = ''
    const c = ExpiringLocalStorage.getDataWithExpiration('ClientFullName')
    if(c) {
      const client = JSON.parse(c)
      if(data) {
        console.log(data);
        const retrievedData = ExpiringLocalStorage.getDataWithExpiration("products")
        const products = retrievedData ? JSON.parse(retrievedData) : []
        dataSetQuotation = {
          currency: client['0'].currency,
          name: name,
          comments: comment,
          client: client['0'].id,
          clientName: client['0'].client,
          advisor: data.id,
          advisorName: data.fullName,
          scenarios: [
            {
              name: 'Primer Escenario',
              selected: true,
              discountPercent: 0,
              applyTaxIVA: iva,
              products: products,
            },
          ]
        }
      }
    } else {
      if(data) {
        const retrievedData = ExpiringLocalStorage.getDataWithExpiration("products")
        const products = retrievedData ? JSON.parse(retrievedData) : []
        dataSetQuotation = {
          currency: data.currency,
          name: name,
          comments: comment,
          client: data.id,
          clientName: data.fullName,
          advisor: data.advisorId,
          advisorName: data.advisorName,
          scenarios: [
            {
              name: 'Primer Escenario',
              selected: true,
              discountPercent: 0,
              applyTaxIVA: iva,
              products: products,
            }
          ]
        }
      }
    }
   
    console.log(dataSetQuotation);
    const createQuotation = async  () => {
      const data = await setQuotation(dataSetQuotation)
      console.log(data);
    }
    createQuotation(dataSetQuotation)
  }
  SendNewScenary() {

  }

  insertList () {
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
          <div class="scenary--row">${product.unitPrice.toLocaleString()}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">${subtotal.toLocaleString()}</div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)
      })
    }
  }
  
  createRow(products) { 
    let prices = ''
    products.forEach(product => {
      const getPrices = async () => {
        if (this.resQueryUser.rol === 'advisors'){
          const c = ExpiringLocalStorage.getDataWithExpiration('ClientFullName')
          const client = JSON.parse(c)
          prices = await getProductPrices(
            product.id,
            client[0].currency,
            client[0].rol
          )
          const priceInRange = this.getPriceInRange(prices, product.quantity)
          if(client[0].currency === 'COP') {
            const numPrange = priceInRange.replace(".", "")
            this.createArrayProducto(product, numPrange)
          } else {
            const numPrange = priceInRange.replace(",", ".")
            this.createArrayProducto(product, numPrange)
          }
         
        } else {
          prices = await getProductPrices(
            product.id,
            this.resQueryUser.currency,
            this.resQueryUser.rol
          )
          if(this.resQueryUser.currency === 'COP') {
            const priceInRange = this.getPriceInRange(prices, product.quantity)
            const numPrange = priceInRange.replace(".", "")
            this.createArrayProducto(product, numPrange)
          } else {
            const priceInRange = this.getPriceInRange(prices, product.quantity)
            const numPrange = priceInRange.replace(",", ".")
            this.createArrayProducto(product, numPrange)
          }
        }
       
        this.sumar()
      }
      getPrices()
    })

    const storedProducts = localStorage.getItem('products')
    if(storedProducts) {
      const productsLocalStores = storedProducts ? JSON.parse(storedProducts) : []
      const productsList = JSON.parse(productsLocalStores.value)
      let subtotal = 0
      productsList.forEach(product => {
        const c = ExpiringLocalStorage.getDataWithExpiration('ClientFullName')
        if (c) {
          const client = JSON.parse(c)
          subtotal = client['0'].currency === 'COP'
            ? Math.floor(product.unitPrice * product.quantity)
            : parseFloat((parseFloat(product.unitPrice) * product.quantity).toFixed(2));
        } else {
          subtotal =  this.resQueryUser.currency === 'COP' ? product.unitPrice * product.quantity : parseFloat((parseFloat(product.unitPrice) * product.quantity).toFixed(2))
        }
        const row = document.createElement('div')
        row.classList.add('scenary--row__table')
        row.classList.add('scenary--row__data')
        row.innerHTML = `
          <div class="scenary--row">${product.productName}</div>
          <div class="scenary--row">${product.selectedMoldeCode}</div>
          <div class="scenary--row">${product.unitPrice.toLocaleString()}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">${subtotal.toLocaleString()}</div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)
      })
    }
    
  }
  createArrayProducto(product, numPrange) {
    if(product) {
      let unitPrice = 0
      const retrievedData = ExpiringLocalStorage.getDataWithExpiration("products")
      let productForSave = []
      if (retrievedData) {
        const productsLocalStores = retrievedData ? JSON.parse(retrievedData) : []
        productForSave = productsLocalStores
      }
      console.log('createArrayProducto', productForSave)
      console.log('createArrayProducto', productForSave)


      /* const indice = productForSave.findIndex(item => item.id === product.id);
      console.log(indice);
      if (indice !== -1) {
        // Si ya existe un elemento con el mismo ID, se suman las cantidades
        productForSave[indice].quantity += productForSave.quantity;
      }  */
      console.log(numPrange);
      const c = ExpiringLocalStorage.getDataWithExpiration('ClientFullName')
      if (c) {
        const client = JSON.parse(c)
        console.log('if');
        unitPrice = client['0'].currency === 'COP' ? parseInt(numPrange) : parseFloat(numPrange).toFixed(2)
      } else {
        console.log('else');
        unitPrice = parseFloat(numPrange).toFixed(2)
      }
     
      productForSave.push({
        product: product.id,
        productName: product.productName,
        selectedMoldeCode: product.selectedMoldeCode,
        quantity: parseInt(product.quantity),
        unitPrice: unitPrice
      })
      ExpiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(productForSave))
      this.removeList()
      this.insertList()
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
      const valor = parseFloat(element.textContent)
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
    const btniva = document.querySelector('.quotation--iva')
    const fieldValor = document.querySelector('.quotation--btn__add')
    fieldValor.textContent = 0
    btniva.addEventListener('click', (e) => {
      this.sumar()
    })
    this.insertList()
  }
}

customElements.define('quotation-calculation', QuotationCalculation)
export default QuotationCalculation
