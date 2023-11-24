import currencyFormatUSD from "../../helpers/currencyFormatUSD.js";
import inputQuantity from "../../helpers/inputQuantity.js";
import nodeNotification from "../../helpers/nodeNotification.js";
import putScenario from "../../services/quotation/putScenario.js";
import getUser from "../../services/user/getUser.js";
import getConfigCurrency from "../../helpers/getConfigCurrency.js";
import ExpiringLocalStorage from '../localStore/ExpiringLocalStorage.js'

const quotationView = async (node, quotation ,infoQuotation) => {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const uid = searchParams.get('uid');
    const resQueryUser = await getUser(uid);
    const currency = quotation.currency

    const container = document.createElement("div");
    container.classList.add("quotatioview--container");
    let elementDiscuount;
    const table = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Molde</th>
                <th>Valor unitario</th>
                <th>Cantidad</th>
                <th>Sub Total</th>
            </tr>
        </thead>
        `;

  infoQuotation.forEach((element) => {
    let productos = "";
    element.products.forEach((producto) => {
      productos += `
            <tbody>
                <tr class="info-name" data-product-id="${producto.product}">
                    <td>${producto.productName}</td>
                    <td id="product-molde">${producto.selectedMoldeCode}</td>
                    <td class="unit-value">
                        ${currency === 'COP' ? 
                            `$ ${producto.unitPrice.toLocaleString()}` : 
                            `$ ${producto.unitPrice.toFixed(2).toLocaleString()}`}
                    </td>
                    <td>
                        <input type="number" value="${producto.quantity.toLocaleString()}"  class="quotatioview--quantity none" readonly />
                    </td>
                    <td class="sub-total">
                        ${currency === 'COP' ? 
                            `$ ${producto.linePrice.toLocaleString()}` : 
                            `$ ${producto.linePrice.toFixed(2).toLocaleString()}`}
                    </td>
                </tr>
            </tbody>
        `;
    });

    const eSubtotalProducts = currencyFormatUSD(element.subtotalProducts ,currency)

    const discount = element.subtotalProducts - element.subtotalWithDiscount
    const discountValue = discount
    
    const configCurrency = getConfigCurrency(currency);
    
    container.innerHTML += `
            <div class="quotatioview__section">
            <div class="quotatioview__actions">
                <div class="quotatioview__edit quotation--btn__new">Editar</div>
                <div class="quotation--btn__save quotation--btn__new quotation-hide">Guardar</div>
            </div>
            <span>Escenario:</span>
            <h2 class="quotatioview__title quotatioview__title--scenary">${element.name}</h2>
            <table class="quotatioview__table">
                ${table}
                ${productos}
            </table>

            <table class="quotatioview__table table__descuento">
            <hr>
                <tbody>
                    <tr>
                        <td class="quotatioview__title--table">Subtotal</td>
                        <td>
                            <div>
                                <span>$</span>
                                <span class="subtotal-products">
                                    ${currency === 'COP' ? 
                                        `${element.subtotalProducts.toLocaleString()}` : 
                                        `${eSubtotalProducts}`}
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="quotatioview__title--table">Descuento</span>
                            <span class="quotatioview__discount">${element.discountPercent.toLocaleString()} % </span>
                        </td>
                        <td>
                            <div>
                                <span>$</span>
                                <span>-</span>
                                <span class="quotatioview__discountValueNumber">
                                    ${currency === 'COP' ? 
                                        `${discountValue.toLocaleString()}` : 
                                        `${discountValue.toFixed(2).toLocaleString()}`}
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="quotatioview__title--table">Subtotal con descuento</td>
                        <td>
                            <div>
                                <span>$</span>
                                <span class="quotatioview__withdiscount">
                                    ${currency === 'COP' ? 
                                    ` ${element.subtotalWithDiscount.toLocaleString()}` : 
                                    ` ${element.subtotalWithDiscount.toFixed(2).toLocaleString()}`}
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr class="iva__products">
                        <td class="quotatioview__title--table">IVA (19%)
                            ${element.taxIVA !== 0 ? 
                            `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                            `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                        </td>
                        <td>
                            <div>
                                <span class="sign-remove">$ </span><span class="iva__products-value">${element.taxIVA.toLocaleString()}</span>
                            </div>
                        </td>
                    </tr>
                    <!-- Puedes agregar más filas aquí -->
                </tbody>
            </table>

            <hr>
            <table class="quotatioview__table table__total">
            <thead>
                <tr>
                    <th class="d-none">
                        <span>Total</span>
                        <div class="quotatioview__iva">
                            <span>IVA (19%)</span>
                            ${element.taxIVA !== 0 ? 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                        </div>
                    </th>
                    <th>
                        <span>Total:</span>
                        <span class="quotatioview__valueTotal">
                            ${currency === 'COP' ? 
                                ` ${element.subtotalWithTaxIVA.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)}` : 
                                ` ${element.subtotalWithTaxIVA.toFixed(2).toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)}`}
                        </span>
                    </th>
                    <td></td>
                </tr>
            </thead>
            </table>
            </div>
      `;
  });
  node.appendChild(container);

  const quotatioviewContainerSection = document.querySelectorAll('.quotatioview__section')
    quotatioviewContainerSection.forEach((section, i) => {
        const quotatioviewEdit = section.querySelector('.quotatioview__edit')

        resQueryUser.rol === 'advisors' ? quotatioviewEdit : quotatioviewEdit.remove()
        quotation.status.id === 1 ? quotatioviewEdit : quotatioviewEdit.remove()

        const quotatioviewTitleScenary = section.querySelector('.quotatioview__title--scenary')
        if (infoQuotation[i].selected === true) {
            quotatioviewTitleScenary.classList.add('selected')
        }
        let infoDiscuount = infoQuotation[i].discountPercent;
        const quotatioviewDiscount = section.querySelector('.quotatioview__discount')
        const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber')
        const quotationBtnSave = section.querySelector('.quotation--btn__save')
        const quotatioviewIva = section.querySelector('.quotatioview--iva')

        const inputNameScenary = `
        <input type="text" id="nameInput" class="nameInput" name="nameInput">
        `
        const inputEdit = `
        <input type="number" id="rangeInput" class="rangeInput" name="rangeInput" min="0" max="10" step="1"> %
        `
        let nameInput;
        let rangeInput
        let inputInserted = false;
        quotatioviewEdit.addEventListener('click', () => {
            quotatioviewEdit.remove()
            if (!inputInserted) {
                inputQuantity(section, quotation.client) 
                const newNode = document.createElement('div');
                newNode.classList.add('quotatioview__title')
                newNode.innerHTML = inputNameScenary.trim();
                
                quotatioviewTitleScenary.parentNode.replaceChild(newNode, quotatioviewTitleScenary);
                //    
                nameInput = section.querySelector('.nameInput')
                nameInput.value = infoQuotation[i].name
                //
                quotationBtnSave.classList.remove('quotation-hide')
                quotatioviewDiscount.style.display = 'none';
                quotatioviewDiscount.insertAdjacentHTML('afterend', inputEdit)
                //
                rangeInput = section.querySelector('.rangeInput')
                rangeInput.value = infoDiscuount
                //
                const quotatioviewWithdiscount = section.querySelector('.quotatioview__withdiscount')
                const quotatioviewValueTotal = section.querySelector('.quotatioview__valueTotal')
                quotatioviewIva.classList.remove('quotation-hide')

                const qncurrencyElement = document.getElementById('qncurrency');
                    const textContent = qncurrencyElement.textContent.trim();

                const mostrarEstadoCheckbox = (discountWithTotal) => {
                    const signRemove = section.querySelector(".sign-remove")
                    if(signRemove) {
                        signRemove.remove()
                    }
                    const dataValueDis = typeof discountWithTotal === 'string' ? discountWithTotal.replace(/,/g, '') : discountWithTotal
                    const ivaProductsValue = section.querySelector('.iva__products-value')
                    let dN = 0;
                    let dataValueDisTotal
                    if (currency === 'COP') {
                        dN = parseInt(discountWithTotal)
                    } else {
                        dN = parseFloat(discountWithTotal)
                    }   
                    
                    const withTaxIVA = currencyFormatUSD(infoQuotation[i].subtotalWithTaxIVA, currency) 
                    const configCurrency = getConfigCurrency(currency);

                    if (quotatioviewIva.checked) {
                        const calculateIva = (dN * 19) / 100                        
                        const calculateIvaTotal = (dN + calculateIva)

                        ivaProductsValue.innerHTML = currency === 'COP' ? calculateIva.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales) : calculateIva.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)
                        quotatioviewValueTotal.innerHTML = currency === 'COP' ? calculateIvaTotal.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales) : calculateIvaTotal.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)
                        //}
                    } else {
                        const calculateIva = 0
                        ivaProductsValue.innerHTML = currency === 'COP' ? calculateIva.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales) : calculateIva.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)
                        if(rangeInput.value == infoQuotation[i].discountPercent) {
                            quotatioviewValueTotal.innerHTML = currency === 'COP' ? infoQuotation[i].subtotalWithDiscount.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales) : dN.toFixed(2).toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)
                        } else {
                            quotatioviewValueTotal.innerHTML = currency === 'COP' ?  dN.toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales) : dN
                        }
                    }
                };
                quotatioviewIva.addEventListener('change', () => {
                    const text = quotatioviewWithdiscount.textContent
                    const numeroFormateado = text.replace(/[^0-9,.]/g, '');
                    mostrarEstadoCheckbox(currency === 'COP' ?  numeroFormateado.replace(/[.,]/g, '') : numeroFormateado); 
                });

                rangeInput.addEventListener('input', (event) => {
                    const maxValue = 10;
                    if (event.target.value > maxValue) {
                        event.target.value = maxValue;
                    }
                    if (event.target.value >= 0) {
                        const subtotalProductsElement = document.querySelector('.subtotal-products');
                        let price
                        if(currency === "COP") {
                            price = parseInt(subtotalProductsElement.textContent.replace(/,/g, ''))
                        } else {
                            price = subtotalProductsElement.textContent.replace(",", ".")
                        }
                        const value = price
                        const calculateDiscout = value * event.target.value / 100
                        const calculateDiscoutTotal = value - calculateDiscout
                        const calculateDiscoutValue = value - calculateDiscoutTotal
                        const calculateDT = currencyFormatUSD(calculateDiscoutTotal, currency)
                        const calculateDV = currencyFormatUSD(calculateDiscoutValue, currency)
                        const configCurrency = getConfigCurrency(currency);
                        quotatioviewWithdiscount.innerHTML = currency === 'COP' ? calculateDiscoutTotal.toLocaleString() : calculateDiscoutTotal.toFixed(2).toLocaleString(configCurrency.idiomaPredeterminado, configCurrency.opcionesRegionales)
                        quotatioviewDiscountValueNumber.innerHTML = currency === 'COP' ? calculateDiscoutValue.toLocaleString() : calculateDV
                        mostrarEstadoCheckbox(currency === 'COP' ? calculateDiscoutTotal : calculateDT);
                    }
                });
                inputInserted = true;
            } 
        })

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
                    "id": infoQuotation[i].id,
                    "name": nameInput.value,
                    "discountPercent": rangeInput.value,
                    "applyTaxIVA": quotatioviewIva.checked,
                    "currency": currency, 
                    "rol": client.rol,
                    "products": productData.products
                }
                putScenario(putBodyScenary)
            })
        }
    });

};


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
  

export default quotationView;
