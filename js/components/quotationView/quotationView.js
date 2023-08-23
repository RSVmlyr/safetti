import currencyFormatUSD from "../../helpers/currencyFormatUSD.js";
import nodeNotification from "../../helpers/nodeNotification.js";
import putScenario from "../../services/quotation/putScenario.js";
import getUser from "../../services/user/getUser.js";

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
                <tr>
                <td>${producto.productName}</td>
                <td>${producto.selectedMoldeCode}</td>
                <td>
                    ${currency === 'COP' ? 
                        `$ ${producto.unitPrice.toLocaleString()}` : 
                        `$ ${producto.unitPrice.toFixed(2).toLocaleString()}`}
                    </td>
                <td>${producto.quantity.toLocaleString()}</td>
                <td>
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
                        <td class="quotatioview__title--table">Costo Productos</td>
                        <td>
                            <div>
                                <span>$</span>
                                <span>
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
                    <!-- Puedes agregar más filas aquí -->
                </tbody>
            </table>

            <hr>
            <table class="quotatioview__table table__total">
            <thead>
                <tr>
                    <th>
                        <span>Total</span>
                        <div class="quotatioview__iva">
                            <span>IVA (19%)</span>
                            ${element.taxIVA !== 0 ? 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                        </div>
                    </th>
                    <th>
                        <span>$ </span>
                        <span class="quotatioview__valueTotal">
                            ${currency === 'COP' ? 
                                ` ${element.subtotalWithTaxIVA.toLocaleString()}` : 
                                ` ${element.subtotalWithTaxIVA.toFixed(2).toLocaleString()}`}
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
            if (!inputInserted) {

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

                    const dataValueDis = typeof discountWithTotal === 'string' ? discountWithTotal.replace(/,/g, '') : discountWithTotal
                    let dN = currency === 'COL' ? parseInt(dataValueDis) : parseFloat(dataValueDis)

                    let dataValueDisTotal
                    if (currency === 'USD') {
                        dataValueDisTotal = currencyFormatUSD(dN, currency)
                    }    
                    
                    const withTaxIVA = currencyFormatUSD(infoQuotation[i].subtotalWithTaxIVA, currency) 



                    if (quotatioviewIva.checked) {

                        if(rangeInput.value == infoQuotation[i].discountPercent) {
                            quotatioviewValueTotal.innerHTML = currency === 'COP' ? infoQuotation[i].subtotalWithTaxIVA.toLocaleString() : withTaxIVA
                        } 
                        const calculateIva = (dN * 19) / 100

                        const calculateIvaTotal = parseInt(dN + calculateIva)

                        const cIvaTotal = currencyFormatUSD(calculateIvaTotal , currency)
                        quotatioviewValueTotal.innerHTML = currency === 'COP' ? calculateIvaTotal.toLocaleString() : cIvaTotal

                    } else {

                        if(rangeInput.value == infoQuotation[i].discountPercent) {
                            quotatioviewValueTotal.innerHTML = currency === 'COP' ? infoQuotation[i].subtotalWithDiscount.toLocaleString() : withTaxIVA
                        } else {
                            quotatioviewValueTotal.innerHTML = currency === 'COP' ? dN.toLocaleString() : dataValueDisTotal
                        }
                    }
                };
                quotatioviewIva.addEventListener('change', () => {
                    resQueryUser.currency === 'COP' ?
                    mostrarEstadoCheckbox(quotatioviewWithdiscount.textContent) :
                    mostrarEstadoCheckbox(quotatioviewWithdiscount.textContent)
                });

                rangeInput.addEventListener('input', (event) => {
                    const maxValue = 10;
                    if (event.target.value > maxValue) {
                        event.target.value = maxValue;
                    }
                    if (event.target.value >= 0) {
                        const calculateDiscout = infoQuotation[i].subtotalProducts * event.target.value / 100
                        const calculateDiscoutTotal = infoQuotation[i].subtotalProducts - calculateDiscout
                        const calculateDiscoutValue = infoQuotation[i].subtotalProducts - calculateDiscoutTotal

                        const calculateDT = currencyFormatUSD(calculateDiscoutTotal, currency)
                        const calculateDV = currencyFormatUSD(calculateDiscoutValue, currency)

                        quotatioviewWithdiscount.innerHTML = currency === 'COP' ? calculateDiscoutTotal.toLocaleString() : calculateDT
                        quotatioviewDiscountValueNumber.innerHTML = currency === 'COP' ? calculateDiscoutValue.toLocaleString() : calculateDV
                        mostrarEstadoCheckbox(currency === 'COP' ? calculateDiscoutTotal.toLocaleString() : calculateDT);
                    }
                });
                inputInserted = true;
            } 
        })

        if (quotationBtnSave) {
            quotationBtnSave.addEventListener('click', () => {
                if (nameInput.value === '') {
                    nodeNotification('El campo NOMBRE DEL ESCENARIO es obligatorio.')
                } else if (rangeInput.value === '') {
                    nodeNotification('El campo DESCUENTO del escenario es obligatorio.')
                }
                const putBodyScenary = {
                    "id": infoQuotation[i].id,
                    "name": nameInput.value,
                    "discountPercent": rangeInput.value,
                    "applyTaxIVA": quotatioviewIva.checked
                    }

                putScenario(putBodyScenary)
            })
        }
    });

};

export default quotationView;
