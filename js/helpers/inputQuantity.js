import getUser from "../services/user/getUser.js"
import getProductPrices from "../services/product/getProductPrices.js"
import getPriceInRange from "./getPriceInRange.js"
import getConfigCurrency from "./getConfigCurrency.js"
import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js"

const inputQuantity = async (section, clienteID) => {
  const quotatioviewQuantity = section.querySelectorAll(".quotatioview--quantity")
  const client = await getInfoUser(clienteID); 

  quotatioviewQuantity.forEach(async (item) => { 
    let delayTimer;
    if (item.hasAttribute("readonly")) {
      item.removeAttribute("readonly");
    }
    item.addEventListener('input', async (event) => {
      const inputValue = event.target.value;
      const parentInfoName = event.target.closest('.info-name');
      clearTimeout(delayTimer);
      if (parentInfoName) {
        const productId = parentInfoName.getAttribute('data-product-id');
        delayTimer = setTimeout(async () => {
          try {
            const prices = await getServicePrices(productId, client)
            const priceUni = getPriceInRange(prices, inputValue);
            const configCurrency = getConfigCurrency(client.currency)
            const subtotalProductsElement = section.querySelector('.subtotal-products');
            const rangeInput = section.querySelector('#rangeInput');
            let price
            if(client.currency === "COP") {
              price = priceUni.replace(".", "")
            } else {
              price = parseFloat(priceUni.replace(",", "."))
            }
            const SubTotal = price * inputValue
            const row = parentInfoName;
            const unitValueElement = row.querySelector('.unit-value');
            if (unitValueElement) {
              //remove $ 
              //input es 1 esta ma el servicio
              unitValueElement.textContent = "$" + priceUni.toLocaleString(
                configCurrency.idiomaPredeterminado,
                configCurrency.opcionesRegionales
              );
            }

            const subTotalElement = row.querySelector('.sub-total');
            if (subTotalElement) {
              subTotalElement.textContent = SubTotal.toLocaleString();
            }
            const totalSum = sumSubTotalValues(section, client.currency);
            if (subtotalProductsElement) {
              subtotalProductsElement.textContent = totalSum.toLocaleString();
            } 
            if(rangeInput){
              const event = new Event('input');
              rangeInput.dispatchEvent(event);
            }

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

const getNumberFromText = (text) => {
  const matches = text.match(/\d|,/g);
  if (matches) {
    return parseInt(matches.join('').replace(/,/g, ''), 10);
  }
  return 0; 
}


const getNumberFromTextFloat = (text) => {
  const cleanedText = text.replace(/[^0-9,.]/g, ''); // Elimina todos los caracteres excepto los números, comas y puntos
  const number = parseFloat(cleanedText.replace(',', '.')); // Reemplaza las comas por puntos y analiza el número
  return isNaN(number) ? 0 : number; // Si no se puede analizar como número, devuelve 0
}


const sumSubTotalValues = (section, currency) => {
  const subTotalElements = section.querySelectorAll('.sub-total');
  let totalSum = 0;
  let value = 0;
  subTotalElements.forEach((element) => {
    const text = element.textContent;
    if(currency === "COP"){
      value = getNumberFromText(text);
    } else {
      value = getNumberFromTextFloat(text);
    }
    totalSum += value;
  });

  return totalSum;
}

export default inputQuantity