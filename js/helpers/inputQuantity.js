import getUser from "../services/user/getUser.js"
import getProductPrices from "../services/product/getProductPrices.js"
import getPriceInRange from "./getPriceInRange.js"
import getConfigCurrency from "./getConfigCurrency.js"
import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js"
import nodeNotification from "../helpers/nodeNotification.js";
import formatNumberWithPoints from "./formatNumberWithPoints.js"

const inputQuantity = async (section, clienteID) => {
  const quotatioviewQuantity = section.querySelectorAll(".quotatioview--quantity")
  const client = await getInfoUser(clienteID); 
  const quotatioviewValueTotal = section.querySelector(".quotatioview__valueTotal")
  const quotatioview__withdiscount = section.querySelector(".quotatioview__withdiscount")
  const ivaProductsValue = section.querySelector(".iva__products-value")
  quotatioviewQuantity.forEach(async (item) => { 
    let delayTimer;
    if (item.hasAttribute("readonly")) {
      item.removeAttribute("readonly");
      item.classList.remove("none");
    }
    item.addEventListener('input', async (event) => {
      const inputValue = event.target.value;
      const parentInfoName = event.target.closest('.info-name');
      clearTimeout(delayTimer);
      if (parentInfoName) {
        const productId = parentInfoName.getAttribute('data-product-id');

        
        delayTimer = setTimeout(async () => {
          const minQuantity = item.dataset.minQuantity;
          const quotationBtnSave = section.querySelector(".quotation--btn__save")
          if(inputValue != '' && inputValue < parseInt(minQuantity)) {
            quotationBtnSave.disabled = true
            nodeNotification(`Las cantidad debe ser mayor o igual a ${minQuantity}`)
            return
          } else {
            quotationBtnSave.disabled = false
          }
          try {
            const prices = await getServicePrices(productId, client)
            const priceUni = getPriceInRange(prices, inputValue);
            const configCurrency = getConfigCurrency(client.currency)
            const subtotalProductsElement = section.querySelector('.subtotal-products');
            const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber');
            const rangeInput = section.querySelector('#rangeInput');

            const SubTotal = parseInt(priceUni.replace(/\./g, '')) * inputValue
            const row = parentInfoName;
            const unitValueElement = row.querySelector('.unit-value');

            if (unitValueElement) {
              unitValueElement.value = formatNumberWithPoints(priceUni)
            }

            const subTotalElement = row.querySelector('.sub-total input');
            if (subTotalElement) {
              subTotalElement.value = formatNumberWithPoints(SubTotal)
            }
            const totalSum = sumSubTotalValues(section, client.currency);
            if (subtotalProductsElement) {
              subtotalProductsElement.value = formatNumberWithPoints(totalSum);
            }
            if(rangeInput){
              const event = new Event('input');
              rangeInput.dispatchEvent(event);
            } 

            // Subtotal con descuento
              if(quotatioview__withdiscount) {
                const subTotalValue = parseInt(subtotalProductsElement.value.replace(/\./g, '')) - parseInt(quotatioviewDiscountValueNumber.value.replace(/\./g, ''))
                console.log(subTotalValue);
                quotatioview__withdiscount.value = formatNumberWithPoints(subTotalValue);
              }
            // Subtotal con descuento
            
            // IVA
            if(ivaProductsValue) {
              const ivaProductsValueFormat = quotatioview__withdiscount.value.replace(/\./g, '')
              const ivaProductsValueCalc = Math.floor((ivaProductsValueFormat * 19) / 100)
              ivaProductsValue.value = formatNumberWithPoints(ivaProductsValueCalc)
            }
            // IVA

            // Total
            const Total = parseInt(quotatioview__withdiscount.value.replace(/\./g, '')) + parseInt(ivaProductsValue.value.replace(/\./g, ''))
            quotatioviewValueTotal.value = formatNumberWithPoints(Total)
            // Total

          } catch (error) {
            console.error('Error al obtener información del usuario:', error);
          }
        }, 500);
      }
    });
  });

  return { msg: 'Vmlyr' };
}

const getServicePrices = async(productId, client) => {
  const prices = await getProductPrices(
    productId,
    client.currency,
    client.rol
  )
  return prices
}

const getInfoUser = async (clienteID) => {
  try {
    const client = await getUser(clienteID);
    const expiringLocalStorage = new ExpiringLocalStorage()
    expiringLocalStorage.saveDataWithExpiration('client', client)
    return client
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
  }
}

const sumSubTotalValues = (section) => {
  const subTotalElements = section.querySelectorAll('.sub-total input');
  let totalSum = 0;
  subTotalElements.forEach((element) => {
    let value = parseInt(element.value.replace(/\./g, ''))
    totalSum += value;
  });

  return totalSum;
}

export default inputQuantity
