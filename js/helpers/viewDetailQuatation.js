import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js";
import nodeNotification from './nodeNotification.js';
import putScenario from "../services/quotation/putScenario.js";
import inputDiscount from "./inputDiscount.js";
import inputQuantity from "./inputQuantity.js";

const viewDetailQuatation = (quotation) => {
  const COP = value => currency(value, { symbol: "$ ", separator: ".", decimal:",", precision: 0 });
  const USD = value => currency(value, { symbol: "$ ", separator: ",", decimal:".", precision: 2 });
  const curr = value => quotation.currency === "COP" ? COP(value) : USD(value);

  const localStRol = localStorage.getItem('rol')

  const quotatioviewContainerScenary = document.querySelectorAll('.quotatioview__section')
  const nodeListScenary = Array.from(quotatioviewContainerScenary)

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

            inputInserted = true;
            inputQuantity(section, quotation.client)
            inputDiscount(section, quotation.currency)

            quotatioviewIva.addEventListener('change', (e) => {
              if (e.target.checked) {
                // IVA
                if(ivaProductsValue) {
                  const ivaProductsValueFormat = curr(quotatioviewWithdiscount.value);
                  const ivaProductsValueCalc = ivaProductsValueFormat.multiply(0.19);
                  const totalIva = ivaProductsValueFormat.add(ivaProductsValueCalc);
                  ivaProductsValue.value = ivaProductsValueCalc.format();
                  quotatioviewValueTotal.value = totalIva.format();
                }
                // IVA
              } else {
                ivaProductsValue.value = curr(0).format();
                quotatioviewValueTotal.value = quotatioviewWithdiscount.value;
              }
            });

          }
        })
      }

      if (quotationBtnSave) {
        quotationBtnSave.addEventListener('click', () => {

            if (nameInput.value === '') {
                nodeNotification('El campo NOMBRE DEL ESCENARIO es obligatorio.');
                return;
            }

            const expiringLocalStorage = new ExpiringLocalStorage();
            const client = expiringLocalStorage.getDataWithExpiration('client');
            const productData = getProductData(section);
            const putBodyScenary = {
                "id": quotation.scenarios[i].id,
                "name": nameInput.value,
                "discountPercent": rangeInput.value ? rangeInput.value : 0,
                "applyTaxIVA": quotatioviewIva.checked,
                "currency": quotation.currency, 
                "rol": client.rol ?? "_final_consumer",
                "products": productData.products
            }
            putScenario(putBodyScenary);
        });
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
  });
}

export default viewDetailQuatation;