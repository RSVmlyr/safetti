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
import { getTranslation } from '../../lang.js'

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
  curr = async value => {
    const until = async (predFn) => {
      const poll = (done) => (predFn() ? done() : setTimeout(() => poll(done), 500));
      return new Promise(poll);
    };

    await until(() => {
      const dataCurrency = document.querySelector("#qncurrency").dataset.currency
      return dataCurrency !== undefined && dataCurrency !== null && dataCurrency !== ""
    });

    return document.querySelector("#qncurrency").dataset.currency === "COP" ? this.COP(value) : this.USD(value)
  } 

  async clone() {
    const url = new URL(window.location.href)
    const searchParams = new URLSearchParams(url.search)
    const clone = searchParams.get('clone')
    const cotId = searchParams.get('cotId')

    if (this.resQueryUser == undefined) {
      const uid = searchParams.get('uid')
      const resQueryUser = await getUser(uid)
      this.resQueryUser = resQueryUser
    }

    const isCloned = clone === 'true'

    if(isCloned) {
      const clonedata = await cloneScenery(cotId)
      this.scenaryId = clonedata.scenarioId
      this.clonecot = true

      if(clonedata) {
        const specialDiscountElement = document.querySelector('.calculation__dis');

        if(specialDiscountElement)
          specialDiscountElement.value = clonedata.discountPercent;

        const btniva = document.querySelector('.quotation--iva');
        if(btniva)
          btniva.checked = clonedata.taxIVA;

        const quotationrepro = document.querySelector('#quotationrepro');
        if(quotationrepro)
          quotationrepro.checked = clonedata.reprogramming;

        const tableHeadRepro = document.querySelectorAll('.quotationew--calculation__titles .reprogramming');
        if(tableHeadRepro && clonedata.reprogramming)
        {
          tableHeadRepro.forEach(element => {
            element.classList.remove('d-none');
          });
        }

        this.moneda = clonedata.moneda
        const expiringLocalStorage = new ExpiringLocalStorage()
        expiringLocalStorage.deleteDataWithExpiration("scenario-" + cotId)
        this.setNameInputClone(clonedata.data)
        await this.createArrayProducto(clonedata.data)
      }
    }
  }

  updateUnitValue() {
    const quotatioviewQuantity = document.querySelectorAll('.quotatioview--quantity')

    quotatioviewQuantity.forEach(element => {
      element.addEventListener("change", async () => {
        let numberValue = parseInt(element.value);
        const dataName = element.closest(".scenary--row__table").querySelector(".name-product").dataset.name;
        const listanumbers = document.querySelectorAll(".scenary--row__data");
        let acumm = 0;

        listanumbers.forEach(function(item) {
          const molde = item.querySelector(".name-product")
          if (molde && dataName === molde.dataset.name) {
            acumm += parseInt(item.querySelector(".quotatioview--quantity").value);
          }
        });

        const minQuantity = parseInt(element.dataset.minQuantity);

        if( acumm < minQuantity ) {
          element.value = numberValue + minQuantity - acumm;
          numberValue = parseInt(element.value);
          nodeNotification(`${ await getTranslation("quantity_validation_error")} ${element.dataset.minQuantity}`);
          //return
        }

        const parentScenaryRow = element.closest('.scenary--row__table')
        const selectedMoldeElement = parentScenaryRow.querySelector('.selected-molde').textContent
        const products = this.retrievedData()

        products.forEach(product => {
          if (product.selectedMoldeCode === selectedMoldeElement) {
            product.quantity = numberValue;
          }
        })

        this.saveData(products);
        await this.createArrayProducto(products, true)
      })
    })

    const reprogrammingChecks = document.querySelectorAll('.quotation-calculation .reprogramming input[type="checkbox"]');

    reprogrammingChecks.forEach(element => {
      element.addEventListener("click", () => {
        const parentScenaryRow = element.closest('.scenary--row__table');
        const selectedMoldeElement = parentScenaryRow.querySelector('.selected-molde').textContent;
        const products = this.retrievedData();
        products.forEach(product => {
          if (product.selectedMoldeCode === selectedMoldeElement) {
            product.reprogramming = element.checked;
          }
        });

        this.saveData(products);
      });
    });

    const productReference = document.querySelectorAll('.quotation-calculation .reprogramming .quotatioview--reference');

    productReference.forEach(element => {
      element.addEventListener("change", async () => {
        const parentScenaryRow = element.closest('.scenary--row__table');
        const selectedMoldeElement = parentScenaryRow.querySelector('.selected-molde').textContent;
        const products = this.retrievedData();
        products.forEach(product => {
          if (product.selectedMoldeCode === selectedMoldeElement) {
            product.reference = element.value;
          }
        });

        this.saveData(products);
      });
    });
  }

  setNameInputClone(data) {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    const newValue = "Cambios " + formattedDate

    setTimeout(() => {
      const input = document.querySelector("#quotationewscenary")
      input.value = newValue
    }, 1000)
  }

  async SendNewQuotation(data, iva, name, comments ) {
    const comment = comments ? comments : ""
    const quo = document.querySelector('.calculation__dis')
    let p = 0
    if(quo && quo.value != "") {
      p = quo.value
    }
    let dataSetQuotation = ''
    const expiringLocalStorage = new ExpiringLocalStorage()
    const c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
    const quotationRepro = document.querySelector('#quotationrepro');

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
          nodeNotification(await getTranslation("quotation_total_error"))
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
          reprogramming: quotationRepro.checked,
          scenarios: [
            {
              name: comment ? comment : await getTranslation("default_scenario_name"),
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
          reprogramming: quotationRepro.checked,
          scenarios: [
            {
              name: comment ? comment : await getTranslation("default_scenario_name"),
              selected: true,
              discountPercent: p,
              applyTaxIVA: iva,
              products: products,
            }
          ]
        }
      }
    }

    await setQuotation(dataSetQuotation);
  }

  async SendNewScenary(data, iva, cotId, nameScenary) {
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
      nodeNotification(await getTranslation("scenario_total_error"))
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

  async insertList () {
    const loadingDivHtml = document.querySelector('.loading-message')

    if (loadingDivHtml) {
      loadingDivHtml.remove()
    }

    const productsList = this.retrievedData()
    const quotationRepro = document.querySelector('#quotationrepro');
    const isReprogramming = quotationRepro && quotationRepro.checked;

    for(const product of productsList){
      const unitPrice = await this.curr(product.unitPrice)
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
        <div class="scenary--row reprogramming ${isReprogramming ? '':'d-none'}">
          <input type="checkbox" ${product.reprogramming ? 'checked':''} style="margin: auto;">
        </div>
        <div class="scenary--row reprogramming ${isReprogramming ? '':'d-none'}">
          <input type="text" value="${product.reference}" class="quotatioview--reference"/>
        </div>
        <div class="scenary--row cancel" data-product='${product.selectedMoldeCode}'></div>
      `
      document.querySelector('.quotationew--calculation__body').appendChild(row)
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

  procesarResult = async(result) => {
    this.removeList()
    this.loading()

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
          let c = expiringLocalStorage.getDataWithExpiration('ClientFullName')

          if(c === null){
            await new Promise(resolve => setTimeout(resolve, 1000));
            c = expiringLocalStorage.getDataWithExpiration('ClientFullName')
          }

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
          nodeNotification(await getTranslation("product_prices_config_error"))
          continue
        }

        if(priceInRange) {
          item.unitPrice = priceInRange.replace(".", "").replace(",",".")
        } else {
          nodeNotification(await getTranslation("no_price_for_quantity") + item.qt)
        }
      } catch (error) {
        console.error('Error al procesar el producto:', error)
      }
    }

    this.saveData(result);
    this.removeList()
    await this.insertList()
    await this.sumar()
    this.updateUnitValue()
  }

  async createArrayProducto(products, is_update=false) {
    const productForSave = this.retrievedData()
    let unitPrice = 0

    if(products) {
      products.forEach(item => {
        item.quantity = Number(item.quantity);
      });

      if(!is_update){
        products.forEach(product => {
          productForSave.push({
            product: product.id,
            productName: product.productName,
            selectedMoldeCode: product.selectedMoldeCode,
            quantity: parseInt(product.quantity),
            unitPrice: unitPrice,
            minQuantity: product.minQuantity,
            reprogramming: product.reprogramming,
            reference: product.reference
          });
        });
      }

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
      let productQuantities = {};

      // Primera pasada: acumular las cantidades por producto
      mergedArray.forEach(item => {
          if (productQuantities[item.product]) {
              productQuantities[item.product] += item.quantity;
          } else {
              productQuantities[item.product] = item.quantity;
          }
      });

      mergedArray.forEach(item => {
        item.qt = productQuantities[item.product];
      });

      await this.procesarResult(mergedArray)
    }
  }

  async showData() {
    this.removeList()
    await this.insertList()
    await this.sumar()
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
      rowT.addEventListener('click', async () => {
        const getDataProduct = rowT.getAttribute('data-product')
        const retrievedDataParse = this.retrievedData()
        const newArray = retrievedDataParse.filter(item => item.selectedMoldeCode !== getDataProduct)
        let productQuantities = {}

        newArray.forEach(item => {
          if (productQuantities[item.product]) {
            productQuantities[item.product] += item.quantity
          } else {
            productQuantities[item.product] = item.quantity
          }
        })

        newArray.forEach(item => {
          item.qt = productQuantities[item.product]

          if(item.qt < item.minQuantity) {
            item.quantity = item.minQuantity;
            item.qt = item.minQuantity;
          }
        })

        await this.procesarResult(newArray)

        const loadingDivHtml = document.querySelector('.loading-message')
        if (loadingDivHtml) {
          loadingDivHtml.remove()
        }
      })
    })
  }
  
  async sumar(){
    const quotationSave = document.querySelector('.quotation--btn__add')
    const quo = document.querySelector('.calculation__dis')
    const btniva = document.querySelector('.quotation--iva')
    const total = await this.btnivaChecked(quo, btniva)
    quotationSave.textContent = total.format()

    if(quo){
      quo.onkeydown = onlyInputNumbers

      quo.addEventListener('input', async (event) => {
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
          const total = await this.btnivaChecked(quo, btniva)
          quotationSave.textContent = total.format()
        }

        await aUser()
      })
    }
  }

  async btnivaChecked (quo, btniva) {
    let total = 0
    let porcentaje = 0
    if(quo) {
      porcentaje = quo.value
    }

    if (btniva.checked) { 
      const subtotal = await this.calcularDescuentoYTotal(porcentaje)
      const iva = subtotal.multiply(0.19)
      total = subtotal.add(iva)
    } else {
      total = await this.calcularDescuentoYTotal(porcentaje)
    }
    return total
  }

  async calcularDescuentoYTotal(porcentaje) {
    const productForSave = this.retrievedData()
    const res = await this.count(productForSave)
    const count = res.count
    document.querySelector(".floating-button .number").textContent = res.countCart
    const disc = count.multiply(porcentaje / 100)
    const total = count.subtract(disc)
    return total
  }

  saveData(products) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const cotId = searchParams.get('cotId');
    const expiringLocalStorage = new ExpiringLocalStorage();

    if(cotId) {
      expiringLocalStorage.saveDataWithExpiration("scenario-" + cotId,  JSON.stringify(products));
    } else{
      expiringLocalStorage.saveDataWithExpiration("products",  JSON.stringify(products));
    }
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
      productForSave = retrievedData ? JSON.parse(retrievedData) : []
    }

    return productForSave
  }

  async count(productForSave){
    let count = await this.curr(0)
    let countCart = 0

    for(const p of productForSave) {
      const temp = (await this.curr(p.unitPrice)).multiply(p.quantity)
      count = count.add(temp)
      countCart += p.quantity
    }

    return {count, countCart} 
  }

  async connectedCallback() {
    const btniva = document.querySelector('.quotation--iva')
    const fieldValor = document.querySelector('.quotation--btn__add')
    const scenaryDeleteAll = document.querySelector('.scenary-delete__all')
    btniva.checked = false
    fieldValor.textContent = 0
    await this.sumar()

    btniva.addEventListener('click', async (e) => {
      await this.sumar()
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
    await this.clone()
  }
}

customElements.define('quotation-calculation', QuotationCalculation)
export default QuotationCalculation