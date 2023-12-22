// viewDetailQuatation

import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js";
import putScenario from "../services/quotation/putScenario.js";
import formatNumberWithPoints from "./formatNumberWithPoints.js";
import inputDiscount from "./inputDiscount.js";
import inputQuantity from "./inputQuantity.js";

const viewDetailQuatation = (quotation) => {
  console.log(quotation);

  const localStRol = localStorage.getItem('rol')

  const quotatioviewContainerScenary = document.querySelectorAll('.quotatioview__section')
  const nodeListScenary = Array.from(quotatioviewContainerScenary)
  const currency = quotation.currency

  nodeListScenary.forEach((section, i) => {

      const quotatioviewEdit = section.querySelector('.quotatioview__edit')

      localStRol === 'advisors' ? quotatioviewEdit : quotatioviewEdit.remove()
      quotation.status.id === 1 ? quotatioviewEdit : quotatioviewEdit.remove()

      const quotatioviewTitleScenary = section.querySelector('.quotatioview__title--scenary')
      if (quotation.scenarios[i].selected === true) {
        quotatioviewTitleScenary.classList.add('selected')
      }

      let infoDiscuount = quotation.scenarios[i].discountPercent;
      const quotatioviewDiscount = section.querySelector('.quotatioview__discount')

      const quotationBtnSave = section.querySelector('.quotation--btn__save')
      const quotatioviewIva = section.querySelector('.quotatioview--iva')
      const ivaProductsValue = section.querySelector(".iva__products-value")

      const inputNameScenary = `
        <input type="text" id="nameInput" class="nameInput" name="nameInput">
      `

      const inputEdit = `
        <input type="number" id="rangeInput" class="rangeInput" name="rangeInput" min="0" max="10" step="1"> %
      `
      let nameInput;
      let rangeInput
      let inputInserted = false;

      if (quotatioviewEdit) {
        quotatioviewEdit.addEventListener('click', (e) => {
          quotatioviewEdit.remove()
          if (!inputInserted) {
            const newNode = document.createElement('div');
            newNode.classList.add('quotatioview__title')
            newNode.innerHTML = inputNameScenary.trim();
            quotatioviewTitleScenary.parentNode.replaceChild(newNode, quotatioviewTitleScenary);
            nameInput = section.querySelector('.nameInput')
            nameInput.value = quotation.scenarios[i].name

            quotationBtnSave.classList.remove('quotation-hide')
            quotatioviewDiscount.style.display = 'none';
            quotatioviewDiscount.insertAdjacentHTML('afterend', inputEdit)

            rangeInput = section.querySelector('.rangeInput')
            rangeInput.value = infoDiscuount

            const quotatioviewWithdiscount = section.querySelector('.quotatioview__withdiscount')
            const quotatioviewValueTotal = section.querySelector('.quotatioview__valueTotal')
            quotatioviewIva.classList.remove('quotation-hide')

            const qncurrencyElement = document.getElementById('qncurrency');
            const textContent = qncurrencyElement.textContent.trim();

            inputInserted = true;
            inputQuantity(section, quotation.client)
            inputDiscount(section)

            quotatioviewIva.addEventListener('change', (e) => {
              if (e.target.checked) {
                console.log('Checkbox marcado');
                // IVA
                if(ivaProductsValue) {
                  const ivaProductsValueFormat = quotatioviewWithdiscount.value.replace(/\./g, '')
                  console.log(ivaProductsValueFormat);
                  const ivaProductsValueCalc = Math.floor((ivaProductsValueFormat * 19) / 100)
                  console.log(ivaProductsValueCalc);
                  const totalIva = parseInt(ivaProductsValueFormat) + ivaProductsValueCalc
                  ivaProductsValue.value = formatNumberWithPoints(ivaProductsValueCalc)
                  quotatioviewValueTotal.value = formatNumberWithPoints(totalIva)
                }
                // IVA
              } else {
                console.log('Checkbox Desmarcado');
                ivaProductsValue.value = 0
                quotatioviewValueTotal.value = quotatioviewWithdiscount.value
              }
            });

          }
        })
      }

      if (quotationBtnSave) {
        quotationBtnSave.addEventListener('click', () => {
            quotationBtnSave.classList.add("disabled")
            if (nameInput.value === '') {
                nodeNotification('El campo NOMBRE DEL ESCENARIO es obligatorio.')
                setTimeout(() => {
                    quotationBtnSave.disabled = false
                }, 2000);
            } else if (rangeInput.value === '') {
                nodeNotification('El campo DESCUENTO del escenario es obligatorio.')
                setTimeout(() => {
                    quotationBtnSave.disabled = false
                }, 2000);
            }
            const expiringLocalStorage = new ExpiringLocalStorage()
            const client = expiringLocalStorage.getDataWithExpiration('client')
            const productData = getProductData(section);
            const putBodyScenary = {
                "id": quotation.scenarios[i].id,
                "name": nameInput.value,
                "discountPercent": rangeInput.value,
                "applyTaxIVA": quotatioviewIva.checked,
                "currency": currency, 
                "rol": client.rol,
                "products": productData.products
            }
            console.log(putBodyScenary);
            putScenario(putBodyScenary)
        })
      }

      const getProductData = (section) => {
        const products = [];
        const table = section.querySelector('.quotatioview__table');
      
        if (table) {
          const rows = table.querySelectorAll('.info-name');
          rows.forEach((row) => {
            const productId = row.getAttribute('data-product-id');
            const productMolde = row.querySelector("#product-molde")
            const parentInfoName = row.closest('.info-name');
            const quantityInput = parentInfoName.querySelector('.quotatioview--quantity');
            const quantity = quantityInput ? quantityInput.value : '';
            if (productId && quantity) {
              products.push({
                molde: productMolde.textContent,
                quantity: parseInt(quantity, 10),
              });
            }
          });
        }
      
        return { products };
    }

      // if (quotationBtnSave) {
      //     quotationBtnSave.addEventListener('click', () => {
      //         quotationBtnSave.classList.add("disabled")
      //         if (nameInput.value === '') {
      //             nodeNotification('El campo NOMBRE DEL ESCENARIO es obligatorio.')
      //             setTimeout(() => {
      //                 quotationBtnSave.disabled = false
      //             }, 2000);
      //         } else if (rangeInput.value === '') {
      //             nodeNotification('El campo DESCUENTO del escenario es obligatorio.')
      //             setTimeout(() => {
      //                 quotationBtnSave.disabled = false
      //             }, 2000);
      //         }
      //         const expiringLocalStorage = new ExpiringLocalStorage()
      //         const client = expiringLocalStorage.getDataWithExpiration('client')
      //         const productData = getProductData(section);
      //         const putBodyScenary = {
      //             "id": infoQuotation[i].id,
      //             "name": nameInput.value,
      //             "discountPercent": rangeInput.value,
      //             "applyTaxIVA": quotatioviewIva.checked,
      //             "currency": currency, 
      //             "rol": client.rol,
      //             "products": productData.products
      //         }
      //         putScenario(putBodyScenary)
      //     })
      // }

  });
 
}

export default viewDetailQuatation

// viewDetailQuatation