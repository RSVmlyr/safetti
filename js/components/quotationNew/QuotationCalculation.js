import nodeNotification from '../../helpers/nodeNotification.js'
import getPriceInRange from "../../helpers/getPriceInRange.js"
import getProductPrices from '../../services/product/getProductPrices.js'
import setQuotation from '../../services/quotation/setQuotation.js'
import setScenario from '../../services/quotation/setScenario.js'
import ExpiringLocalStorage from '../localStore/ExpiringLocalStorage.js'
import loadingData from "../../helpers/loading.js"
import onlyInputNumbers from "../../helpers/onlyInputNumbers.js"
import getUser from "../../services/user/getUser.js"
import cloneScenery from "../../helpers/cloneScenery.js"
import putScenario from "../../services/quotation/putScenario.js";


class QuotationCalculation extends HTMLElement {
  constructor(resQueryUser) {
    super()
    this.resQueryUser = resQueryUser
    this.countCart = 0
    this.moneda = ''
    this.selectedSend = false
    this.clonesend = false
    this.clonecot = false
    //this.scenaryId = ''
    this.innerHTML = `
      <div class="quotation-calculation">
        <div class="quotationew--calculation__body">
        </div>
      </div>`

    document.querySelector('.quotation--btn__add').textContent = "0"
    document.querySelector(".floating-button .number").textContent = "0"
    this.currentPrices = []
  }

  COP = value => currency(value, { symbol: "", separator: ".", decimal:",", precision: 0 })
  USD = value => currency(value, { symbol: "", separator: ",", decimal:".", precision: 2 })
  curr = value => document.querySelector("#qncurrency").dataset.currency === "COP" ? this.COP(value) : this.USD(value)

  async clone () {
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const clone = searchParams.get('clone')
    const cotId = searchParams.get('cotId')
    if ( this.resQueryUser  == undefined) {
      const uid = searchParams.get('uid')
      const resQueryUser = await getUser(uid)
      this.resQueryUser = resQueryUser
    }
    const isCloned = clone === 'true'
    if(isCloned) {      
      const sliderProductos = document.querySelectorAll(".slider--productos .slider--row")
      const clonedata = await cloneScenery(cotId)

      this.scenaryId = clonedata.data[0].scenarioId

      console.log("this.scenaryId ", this.scenaryId );
      
      
      this.clonecot = true
      if(clonedata) {
        this.moneda = clonedata.moneda
        const expiringLocalStorage = new ExpiringLocalStorage()
        expiringLocalStorage.deleteDataWithExpiration("scenario-" + cotId)
        this.setNameInputClone(clonedata.data)
        this.createArrayProducto(clonedata.data)
      }
    }
  }
  updateUnitValue() {
    const quotatioviewQuantity = document.querySelectorAll('.quotatioview--quantity')
    quotatioviewQuantity.forEach(element => {
      element.addEventListener("change", () => {
        let numberValue = element.value
        const dataName = element.closest(".scenary--row__table").querySelector(".name-product").dataset.name;
        const listanumbers = document.querySelectorAll(".scenary--row__data");
        let acumm = 0;


        listanumbers.forEach(function(item) {
          const molde = item.querySelector(".name-product")
          if (molde) {
            if (dataName === molde.dataset.name) {
              const numbeQuantity = parseInt(item.querySelector(".quotatioview--quantity").value);
              acumm += numbeQuantity;
            } else {
              //acumm = 0
              acumm = parseInt(item.querySelector(".quotatioview--quantity").value)
            }
          }
        });

        if( acumm < parseInt(element.dataset.minQuantity) ) {
          nodeNotification(`La cantidad total debe ser mayor o igual a ${element.dataset.minQuantity}`);
          return
        } else {
          const url = new URL(window.location.href)
          const searchParams = new URLSearchParams(url.search)
          const cotId = searchParams.get('cotId')
          const expiringLocalStorage = new ExpiringLocalStorage()
          const parentScenaryRow = element.closest('.scenary--row__table')
          const selectedMoldeElement = parentScenaryRow.querySelector('.selected-molde').textContent

          let retrievedData = ''
          if(cotId) {
            retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
          } else {
            retrievedData = expiringLocalStorage.getDataWithExpiration("products")
          }
          const products = retrievedData ? JSON.parse(retrievedData) : []

          products.forEach(product => {
            if (product.selectedMoldeCode === selectedMoldeElement) {
              product.quantity = parseInt(numberValue)
            }
          })
          
          if(cotId) {
            expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(products))
          } else{
            expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(products))
          } 

          this.createArrayProducto(products, true) 
        }
      })
    })
  }
  setNameInputClone(data) {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    const newValue = "Cambios " + formattedDate
    setTimeout(() => {
      const input = document.querySelector("#quotationewscenary")      
      input.value = newValue
    }, 4000)
  }

  SendNewQuotation(data, iva, name, comments ) {
    const comment = comments ? comments : ""
    const quo = document.querySelector('.calculation__dis')
    let p = 0
    if(quo && quo.value != "") {
      p = quo.value
    }
    let dataSetQuotation = ''
    const expiringLocalStorage = new ExpiringLocalStorage()
    const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    if(c) {
      const client = JSON.parse(c)
      if(client['0'].currency === undefined && client['0'].rol === undefined){
        client['0'].currency = 'COP'
        client['0'].rol = '_final_consumer'
      }
      if(data) {
        const retrievedData = expiringLocalStorage.getDataWithExpiration("products")
        const products = retrievedData ? JSON.parse(retrievedData) : []
        if(products.length <= 0){
          nodeNotification('La cotización tiene un valor de cero.')
          return null
        }
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
              name: 'Escenario inicial',
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

  SendNewScenary(data, iva, cotId, nameScenary) {
    let dataSetScenario = ''
    const expiringLocalStorage = new ExpiringLocalStorage()
    const retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
    const scenary = retrievedData ? JSON.parse(retrievedData) : []
    const specialDiscountElement = document.querySelector('.calculation__dis')
    let specialDiscount = 0
    if(specialDiscountElement && specialDiscountElement.value != "") {
      specialDiscount = specialDiscountElement.value
    }

    if(data.length <= 0){
      nodeNotification('El escenario tiene un valor de cero.')
      return null
    }
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const clone = searchParams.get('clone')
    const isCloned = clone === 'true'
    if(isCloned) {
      this.selectedSend = true
      this.clonesend = true
    }
    
    if(data) {
      dataSetScenario = {
        "quotationId": cotId,
        "name": nameScenary,
        "selected": this.selectedSend,
        "clone": this.clonesend,
        "discountPercent": specialDiscount,
        "applyTaxIVA": iva,
        "products": scenary,
      }
      const edit = searchParams.get('edit')
      const scenaryId = searchParams.get('scenaryId')

      console.log("this.scenaryId 2", this.scenaryId );


      const updateScenario = async  () => {
        const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
        const client = JSON.parse(c)        
        let currency = ''
        let rol = ''

        if(client['0'].currency === undefined && client['0'].rol === undefined){
          currency = 'COP'
          rol = '_final_consumer'
        } else {
          currency = client['0'].currency 
          rol = client['0'].rol 
        }
        const products = dataSetScenario.products.map(item => ({
          molde: item.selectedMoldeCode,
          quantity: item.quantity
        }));
        
        const putBodyScenary = {
          "id": scenaryId,
          "name": dataSetScenario.name,
          "discountPercent": dataSetScenario.discountPercent,
          "currency": currency,
          "rol": rol,
          "applyTaxIVA": dataSetScenario.applyTaxIVA,
          "products": products
        }
        const data = await putScenario(putBodyScenary, cotId)
      }
      const createScenario = async  () => {
        const data = await setScenario(dataSetScenario, cotId)
      }

      if(edit) {
        updateScenario(dataSetScenario)
      } else {
        createScenario(dataSetScenario)
      }
    }
  }

  insertList () {
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const cotId = searchParams.get('cotId')
    const expiringLocalStorage = new ExpiringLocalStorage()
    let retrievedData = ''
    const loadingDivHtml = document.querySelector('.loading-message')

    if (loadingDivHtml) {
      loadingDivHtml.remove()
    }

    if(cotId) {
      retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)

    } else {
      retrievedData = expiringLocalStorage.getDataWithExpiration("products")
    }
    if(retrievedData) {
      const productsList = retrievedData ? JSON.parse(retrievedData) : []

      productsList.forEach(product => {
        const unitPrice = this.curr(product.unitPrice)
        const valueSubtotal = unitPrice.multiply(product.quantity).format()
        const row = document.createElement('div')
        row.classList.add('scenary--row__table')
        row.classList.add('scenary--row__data')
        row.innerHTML = `
          <div class="scenary--row name-product" data-name="${product.product}">${product.productName}</div>
          <div class="scenary--row selected-molde">${product.selectedMoldeCode}</div>
          <div class="scenary--row">$ ${unitPrice.format()}</div>
          <div class="scenary--row">
            <input type="number" value="${product.quantity}" data-min-quantity="${product.minQuantity}" class="quotatioview--quantity"/>
          </div>
          <div class="scenary--row subtotal">$ ${valueSubtotal}</div>
          <div class="scenary--row cancel" data-product='${product.selectedMoldeCode}'></div>
        `
        document.querySelector('.quotationew--calculation__body').appendChild(row)
      })
    }
    const scenaryRowTable = document.querySelectorAll('.scenary--row__table .cancel')
    this.removeItem(scenaryRowTable)
  }

  loading() {
    const quotationContentListContainer = document.querySelector('.quotationew--calculation__body')
    const loadingDiv = loadingData(quotationContentListContainer)
    quotationContentListContainer.appendChild(loadingDiv)
  }

  getServicePrices = async (productId, currency, rol) => {
    const prices = this.currentPrices.find(element => {
        return element.productId == productId &&
        element.currency == currency &&
        element.rol == rol})
    
    if(prices) {
      return prices
    }
    else {
      const prices = await getProductPrices(productId, currency, rol)
      this.currentPrices.push(prices)
      return prices
    }
  }
  
  addTotalQuantity = (items) => {
    // Crear un objeto para almacenar las cantidades totales por id
    const totalQuantities = items.reduce((acc, item) => {
      const id = item.id;
      const quantity = parseInt(item.quantity, 10);
      
      if (acc[id]) {
          acc[id] += quantity;
      } else {
          acc[id] = quantity;
      }
      
      return acc;
    }, {});
    
    return items.map(item => ({
      ...item,
      cantTotal: totalQuantities[item.id]
    }));
};

  procesarResult = async(result) =>  {
    this.removeList()
    this.loading()
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const cotId = searchParams.get('cotId')

    const expiringLocalStorage = new ExpiringLocalStorage()
    for (const item of result) {
      try {
        let price
        const rol =  localStorage.getItem('rol')
      
        let currency = ''
        if(this.moneda) {
          currency = this.moneda
        } else {
          currency = document.querySelector("#qncurrency").dataset.currency
        }
        if (rol === 'advisors') {
          const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
          const client = JSON.parse(c)
          if(client['0'].currency === undefined && client['0'].rol === undefined){
            client['0'].currency = 'COP'
            client['0'].rol = '_final_consumer'
          }
          price = await this.getServicePrices(item.product, currency, client['0'].rol)
        } else {
          price = await this.getServicePrices(item.product, currency, this.resQueryUser.rol)
        }        
        const priceInRange = getPriceInRange(price, item.qt)
        if (priceInRange === undefined) {
          console.error('Error en este producto:', item)
          nodeNotification('Error en la configuración de precios del producto')
          continue
        }

        if(priceInRange)
        {
          item.unitPrice = priceInRange.replace(".", "").replace(",",".")
        } else {
          nodeNotification('No existe un precio configurado para la cantidad ' + item.qt)
        }
      } catch (error) {
        console.error('Error al procesar el producto:', error)
      }
    }

    if(cotId) {
      expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(result))
    }
    else{
      expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(result))
    }
    //this.showData()
    this.removeList()
    this.insertList()
    this.sumar()
    this.updateUnitValue()
  }

  createArrayProducto(products, is_update=false) {
    const expiringLocalStorage = new ExpiringLocalStorage()
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const cotId = searchParams.get('cotId')
    let productForSave = []
    let unitPrice = 0
    let retrievedData = ''   
    let productQuantities = []

    if(cotId) {
      retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
    } else{
      retrievedData = expiringLocalStorage.getDataWithExpiration("products")
    }
    if (retrievedData) {
      productForSave = JSON.parse(retrievedData)
    }

    if(products) {
      products.forEach(item => {
        item.quantity = Number(item.quantity);
      });
    
      products.forEach(product => {        
        if(!is_update){
          productForSave.push({
            product: product.id,
            productName: product.productName,
            selectedMoldeCode: product.selectedMoldeCode,
            quantity: parseInt(product.quantity),
            unitPrice: unitPrice,
            minQuantity: product.minQuantity
          })
        }
      })


      let mergedProducts = {};

      productForSave.forEach(item => {
        if (!mergedProducts[item.selectedMoldeCode]) {
          mergedProducts[item.selectedMoldeCode] = { ...item, qt: item.quantity };
        } else {
          mergedProducts[item.selectedMoldeCode].quantity += item.quantity;
          mergedProducts[item.selectedMoldeCode].qt += item.quantity;
        }
      });
      let mergedArray = Object.values(mergedProducts);
      //let totalQuantity = mergedArray.reduce((total, item) => total + item.quantity, 0);
      let productQuantities = {};

      // Primera pasada: acumular las cantidades por producto
      mergedArray.forEach(item => {
          const productNumber = item.product;
          const quantity = item.quantity;

          if (productQuantities[productNumber]) {
              productQuantities[productNumber] += quantity;
          } else {
              productQuantities[productNumber] = quantity;
          }
      });

      mergedArray.forEach(item => {
        item.qt = productQuantities[item.product];
      });

      
      if(cotId) {
        expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(mergedArray))
      } else{
        expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(mergedArray))
      }
      this.procesarResult(mergedArray)
    }
  }

  showData() {
    const expiringLocalStorage = new ExpiringLocalStorage()
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const cotId = searchParams.get('cotId')
    let retrievedData = ''
    let productForSave = {}

    if(cotId) {
      retrievedData = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
    }
    else{
      retrievedData = expiringLocalStorage.getDataWithExpiration("products")
    }

    if (retrievedData) {
      productForSave = JSON.parse(retrievedData)
    }

    this.removeList()
    this.insertList()
    this.sumar()
    this.updateUnitValue()
  }

  removeList() {
    document.querySelector(".floating-button .number").textContent = "0"
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
        const url = new URL(window.location.href)
        const searchParams = new URLSearchParams(url.search)
        const cotId = searchParams.get('cotId')

        const retrievedDataParse = this.retrievedData()
        const newArray = retrievedDataParse.filter(item => item.selectedMoldeCode !== getDataProduct)
        let productQuantities = {}

        newArray.forEach(item => {
          const productNumber = item.product
          const quantity = item.quantity
          if (productQuantities[productNumber]) {
            productQuantities[productNumber] += quantity
          } else {
            productQuantities[productNumber] = quantity
          }
        })

        newArray.forEach(item => {
          item.qt = productQuantities[item.product]
        })

        if(cotId) {
          expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(newArray))
        } else{
          expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(newArray))
        }

        this.procesarResult(newArray).then(() => {
          const loadingDivHtml = document.querySelector('.loading-message')
          if (loadingDivHtml) {
            loadingDivHtml.remove()
          }
          if(cotId) {
            expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(newArray))
          } else{
            expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(newArray))
          }
          const products = retrievedData ? JSON.parse(retrievedData) : []

          this.removeList()
          this.createArrayProducto(newArray)
          this.insertList()
          this.sumar()

        })
      })
    })
  
  }
  
  sumar(){
    const quotationSave = document.querySelector('.quotation--btn__add')
    const quo = document.querySelector('.calculation__dis')
    const btniva = document.querySelector('.quotation--iva')
    const total = this.btnivaChecked(quo, btniva)
    quotationSave.textContent = total.format()

    if(quo){
      quo.onkeydown = onlyInputNumbers

      quo.addEventListener('input', (event) => {
        let maxValue = 10
        const aUser = async() =>{
          const url = new URL(window.location.href)
          const searchParams = new URLSearchParams(url.search)
          const uid = searchParams.get('uid') || '94' //27      
          const resQueryUser = await getUser(uid)
          if(resQueryUser.rol == "advisors" && resQueryUser.allowCustomDiscounts === true) {
            maxValue = 100
          } 
          if (event.target.value > maxValue) {
            event.target.value = maxValue
          }
          const total = this.btnivaChecked(quo, btniva)
          quotationSave.textContent = total.format()
        }
        aUser()
      })
    }
  }

  btnivaChecked (quo, btniva) {
    let total = 0
    let porcentaje = 0
    if(quo) {
      porcentaje = quo.value
    }

    if (btniva.checked) { 
      const subtotal = this.calcularDescuentoYTotal(porcentaje)
      const iva = subtotal.multiply(0.19)
      total = subtotal.add(iva)
    } else {
      total = this.calcularDescuentoYTotal(porcentaje)
    }
    return total
  }

  calcularDescuentoYTotal(porcentaje) {
    const productForSave = this.retrievedData()
    const res = this.count(productForSave)
    const count = res.count
    document.querySelector(".floating-button .number").textContent = res.countCart
    const disc = count.multiply(porcentaje / 100)
    const total = count.subtract(disc)
    return total
  }

  retrievedData(){
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
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
    let count = this.curr(0)
    let countCart = 0
    productForSave.forEach(e => {
      const temp = this.curr(e.unitPrice).multiply(e.quantity)
      count = count.add(temp)
      countCart += e.quantity
    })
    return {count, countCart} 
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
      const url = new URL(window.location.href)
      const searchParams = new URLSearchParams(url.search)
      const cotId = searchParams.get('cotId')
      if(cotId) {
        expiringLocalStorage.deleteDataWithExpiration("scenario-" + cotId)
      } else{
        expiringLocalStorage.deleteDataWithExpiration("products")
      }
      fieldValor.textContent = '0'
      this.removeList()
    })
    //this.insertList()
    const scenaryRowTable = document.querySelectorAll('.scenary--row__table .cancel')
    this.removeItem(scenaryRowTable)
    this.clone()
  }
}

customElements.define('quotation-calculation', QuotationCalculation)
export default QuotationCalculation