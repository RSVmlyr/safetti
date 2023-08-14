import getUnityPrices from '../../helpers/getUnityPrices.js'
import nodeNotification from '../../helpers/nodeNotification.js'
import getProductPrices from '../../services/product/getProductPrices.js'
import setQuotation from '../../services/quotation/setQuotation.js'
import setScenario from '../../services/quotation/setScenario.js'
import getUser from "../../services/user/getUser.js";
import ExpiringLocalStorage from '../localStore/ExpiringLocalStorage.js'
class QuotationCalculation extends HTMLElement {
  constructor(resQueryUser) {
    super()
    //this.sumar()
    this.resQueryUser = resQueryUser
    this.innerHTML = `
      <div class="quotation-calculation">
        <div class="quotationew--calculation__body">
        </div>
      </div>
    `
  }
  getPriceInRange(prices, value) {
    if (prices != undefined) {
      if (value <= 5) {
        return prices["p" + value]
      }

      if (value >= 5 && value < 10) {
        return prices["p5"]
      }

      if (value >= 10 && value < 15) {
        return prices["p10"]
      }

      if (value >= 15 && value < 20) {
        return prices["p15"]
      }

      if (value >= 20 && value < 50) {
        return prices["p20"]
      }

      if (value >= 50 && value < 100) {
        return prices["p50"]
      }

      if (value >= 100 && value < 300) {
        return prices["p100"]
      }
      
      if (value >= 300) {
        return prices["p300"]
      }
    }
  }

  SendNewQuotation(data, iva, name, comments ) {
    const comment = comments ? comments : "string"
    const quo = document.querySelector('.calculation__dis')
    let p = 0
    if(quo != null) {
      p = quo.value
    }
    let dataSetQuotation = ''
    const expiringLocalStorage = new ExpiringLocalStorage()
    const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    if(c) {
      const client = JSON.parse(c)
      if(data) {
        const retrievedData = expiringLocalStorage.getDataWithExpiration("products")
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
              discountPercent: p,
              applyTaxIVA: iva,
              products: products,
            },
          ]
        }
      }
    } else {
      if(data) {
        const retrievedData = expiringLocalStorage.getDataWithExpiration("products")
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
              discountPercent: p,
              applyTaxIVA: iva,
              products: products,
            }
          ]
        }
      }
    }
    const createQuotation = async () => {
      const data = await setQuotation(dataSetQuotation)
    }
    createQuotation(dataSetQuotation)
  }

  SendNewScenary(data, cotId, nameScenary) {
    let dataSetScenario = ''
    const expiringLocalStorage = new ExpiringLocalStorage()
    const retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
    const scenary = retrievedData ? JSON.parse(retrievedData) : []
    let specialDiscount = data.specialDiscount; 
    specialDiscount = specialDiscount !== null && !isNaN(specialDiscount) ? specialDiscount : 0;
    if(data) {
      dataSetScenario = {
        "quotationId": cotId,
        "name": nameScenary,
        "selected": false,
        "discountPercent": parseInt(specialDiscount),
        "applyTaxIVA": true,
        "products": scenary,
      }
      const createScenario = async  () => {
        const data = await setScenario(dataSetScenario, cotId)
      }
      createScenario(dataSetScenario)
    }
  }

  insertList () {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const cotId = searchParams.get('cotId')
    const expiringLocalStorage = new ExpiringLocalStorage()
    let retrievedData = ''
    if(cotId) {
      retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)

    } else {
      retrievedData = expiringLocalStorage.getDataWithExpiration("products")
    }
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
          <div class="scenary--row">$ ${product.unitPrice.toLocaleString()}</div>
          <div class="scenary--row">${product.quantity}</div>
          <div class="scenary--row subtotal">$ ${subtotal.toLocaleString()}</div>
          <div class="scenary--row cancel" data-product='${product.selectedMoldeCode}'></div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)

      })
    }
    const scenaryRowTable = document.querySelectorAll('.scenary--row__table .cancel')
    this.removeItem(scenaryRowTable)
  }

  createRow(products) {
    const expiringLocalStorage = new ExpiringLocalStorage()
    let prices = ''
    products.forEach(product => {
      const getPrices = async () => {
        if (this.resQueryUser.rol === 'advisors'){
          const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
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
        const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
        if (c) {
          const client = JSON.parse(c)
          subtotal = client['0'].currency === 'COP'
            ? Math.floor(product.unitPrice * product.quantity)
            : parseFloat((parseFloat(product.unitPrice) * product.quantity).toFixed(2))
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

  createArrayProducto(products) {
    const expiringLocalStorage = new ExpiringLocalStorage()
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const cotId = searchParams.get('cotId')

    let result = ''
    let productForSave = []

    if(products) {
      let unitPrice = 0
      let retrievedData = ''
      let numPrange = ''
      let price = ''
      products.forEach(product => { 
        const productsDataAsync = async () => {
          if(cotId) {
            retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
          } else{
            retrievedData = expiringLocalStorage.getDataWithExpiration("products")
          }
        
          if (retrievedData) {
            const productsLocalStores = retrievedData ? JSON.parse(retrievedData) : []
            productForSave = productsLocalStores
          }

          if (this.resQueryUser.rol === 'advisors'){
            const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
            const client = JSON.parse(c)
            price = await getUnityPrices(product.id, client['0'].currency, client['0'].rol);    
            const priceInRange = this.getPriceInRange(price, product.quantity)
            if(!priceInRange){
              console.log('error this producto', product);
              nodeNotification('Error en la información del producto')
              return null
            }
            if(client['0'].currency === 'COP') {
              numPrange = priceInRange.replace(".", "")
            } else {
              numPrange = priceInRange.replace(",", ".")
            }
            if (c) {
              unitPrice = client['0'].currency === 'COP' ? parseInt(numPrange) : parseFloat(numPrange).toFixed(2)
            } else {
              unitPrice = parseFloat(numPrange).toFixed(2)
            }
          } else {
            price = await getProductPrices(
              product.id,
              this.resQueryUser.currency,
              this.resQueryUser.rol
            )
            const priceInRange = this.getPriceInRange(price, product.quantity)
            if(this.resQueryUser.currency === 'COP') {
              numPrange = priceInRange.replace(".", "")
              unitPrice = parseInt(numPrange)
            } else {
              numPrange = priceInRange.replace(",", ".")
              unitPrice = parseFloat(numPrange).toFixed(2)
            }
          }
        
          productForSave.push({
            product: product.id,
            productName: product.productName,
            selectedMoldeCode: product.selectedMoldeCode,
            quantity: parseInt(product.quantity),
            unitPrice: unitPrice
          })

          result = Object.values(productForSave.reduce((acc, item) => {
            const id = item.selectedMoldeCode;
            if (acc[id]) {
              acc[id].quantity += parseInt(item.quantity);
              const priceInRange = this.getPriceInRange(price, acc[id].quantity)
              const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
              const client = JSON.parse(c)

              if (c) {
                if(client['0'].currency === 'COP') {
                  numPrange = priceInRange.replace(".", "")
                } else {
                  numPrange = priceInRange.replace(",", ".")
                }
                unitPrice = client['0'].currency === 'COP' ? parseInt(numPrange) : parseFloat(numPrange).toFixed(2)
              } else {
                // Validar cuando es dolar
                if(this.resQueryUser.currency === 'COP') {
                  numPrange = priceInRange.replace(".", "")
                } else {
                  numPrange = priceInRange.replace(",", ".")
                }
                unitPrice = parseFloat(numPrange).toFixed(2)
              }
              acc[id].unitPrice = unitPrice
            } else {
              acc[id] = { ...item };
            }
            return acc;
          }, {}));

          if(cotId) {
            expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(result))
          } else{
            expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(result))
          }

          this.removeList()
          this.insertList()
          this.sumar()
        }
        productsDataAsync();
      });
    }
  }

  removeList() {
    const scenaryTableRow = document.querySelectorAll('.scenary--row__table .scenary--row')
    scenaryTableRow.forEach((e, i) => {
      e.remove()
    })
  }

  removeItem(scenaryRowTable) {
    scenaryRowTable.forEach(rowT => {
      rowT.addEventListener('click', () => {
        const getDataProduct = rowT.getAttribute('data-product')
        const expiringLocalStorage = new ExpiringLocalStorage()
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        const cotId = searchParams.get('cotId')

        const retrievedDataParse = this.retrievedData()
        //const retrievedDataParse = JSON.parse(retrievedData)
        const newArray = retrievedDataParse.filter(item => item.selectedMoldeCode !== getDataProduct);
        if(cotId) {
          expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(newArray))
        } else{
          expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(newArray))
        }
        this.removeList()
        this.insertList()
        this.sumar()
      })
    });
  }
  
  sumar(){
    const quotationSave = document.querySelector('.quotation--btn__add')
    const quo = document.querySelector('.calculation__dis')
    const expiringLocalStorage = new ExpiringLocalStorage()
    const clientename = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    const client = JSON.parse(clientename)
    const btniva = document.querySelector('.quotation--iva')

    if(client){
      const productForSave = this.retrievedData()
      const count = this.count(productForSave)
      const numeroclean = client['0'].currency === 'COP' ? count :  parseFloat(count);
      const t = this.btnivaChecked(numeroclean, client['0'].currency, quo, btniva)
      quotationSave.textContent = t.toLocaleString()
      quo.addEventListener('input', (event) => {
        const maxValue = 10;
        if (event.target.value > maxValue) {
          event.target.value = maxValue;
        }
        const porcentaje = event.target.value;
        const numeroclean = this.calcularDescuentoYTotal(porcentaje, client['0'].currency);
        const total = this.btnivaChecked(numeroclean,  client['0'].currency, quo, btniva)
        quotationSave.textContent = total.toLocaleString();
      });
    } else {
      const productForSave = this.retrievedData()
      const numeroclean = this.count(productForSave)
      const qncurrencyElement = document.getElementById('qncurrency');
      const textContent = qncurrencyElement.textContent.trim();
      const currency = textContent.replace(/Moneda: /g, "");
      const total = this.btnivaChecked(numeroclean, currency, quo, btniva)
      quotationSave.textContent = total.toLocaleString()
    }
  } 

  btnivaChecked (numeroclean, currency, quo, btniva){
    let total = 0
    const numero = currency === 'COP' ? (parseInt(numeroclean)) : (parseFloat(numeroclean)).toFixed(2)
    if (btniva.checked) {  
      const iva = (numero * 19) / 100
      const valuesIva = currency === 'COP' ? (parseInt(iva)) : parseFloat(iva)
       
      total = currency === 'COP' ? (parseInt(numero) + valuesIva) : (parseFloat(numero) + valuesIva)
    } else {
      const productForSave = this.retrievedData()
      const count = this.count(productForSave)
      //const a = currency === 'COP' ? (parseInt(count)) : (parseFloat(count)).toFixed(2)
      let porcentaje = 0
      if(quo != null) {
        porcentaje = quo.value
      }
      total = this.calcularDescuentoYTotal(porcentaje, currency);
    }
    return total
  }

  calcularDescuentoYTotal(porcentaje, currency) {
    const productForSave = this.retrievedData()
    const count = this.count(productForSave)
    const disc = (count * porcentaje / 100);
    const total = currency === 'COP' ? parseInt(count - disc) : parseFloat(count - disc).toFixed(2);
    return total
  }

  retrievedData(){
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const cotId = searchParams.get('cotId')
    const expiringLocalStorage = new ExpiringLocalStorage()
    let retrievedData = ''
    if(cotId) {
      retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
    } else{
      retrievedData = expiringLocalStorage.getDataWithExpiration("products")
    }
    let productForSave = []
    if (retrievedData) {
      const productsLocalStores = retrievedData ? JSON.parse(retrievedData) : []
      productForSave = productsLocalStores
    }
    return productForSave
  }

  count (productForSave){
    const expiringLocalStorage = new ExpiringLocalStorage()
    const clientename = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    let count = 0
    let valor = 0
    productForSave.forEach(e => {
      if (clientename) {
        valor = parseInt(e.textContent)
        const client = JSON.parse(clientename)
        count += client['0'].currency === 'COP' ?parseInt(e.unitPrice * e.quantity) :parseFloat(e.unitPrice * e.quantity)
      } else {
        valor = parseFloat(e.unitPrice * e.quantity)
        count += parseFloat(valor)
      }
    })
    return count 
  }

  connectedCallback() {
    const btniva = document.querySelector('.quotation--iva')
    const fieldValor = document.querySelector('.quotation--btn__add')
    const scenaryDeleteAll = document.querySelector('.scenary-delete__all')
    btniva.checked = false
    fieldValor.textContent = 0
    this.sumar()
    btniva.addEventListener('click', (e) => {
      this.sumar()
    })
    scenaryDeleteAll.addEventListener('click', () => {
      const expiringLocalStorage = new ExpiringLocalStorage()
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      const cotId = searchParams.get('cotId')
      if(cotId) {
        expiringLocalStorage.deleteDataWithExpiration("scenario-" + cotId)
      } else{
        expiringLocalStorage.deleteDataWithExpiration("products")
      }
      fieldValor.textContent = '0'
      this.removeList()
    })
    this.insertList()
    const scenaryRowTable = document.querySelectorAll('.scenary--row__table .cancel')
    this.removeItem(scenaryRowTable)
  }
}

customElements.define('quotation-calculation', QuotationCalculation)
export default QuotationCalculation
