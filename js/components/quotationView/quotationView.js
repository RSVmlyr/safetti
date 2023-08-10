import putScenario from "../../services/quotation/putScenario.js";
import getUser from "../../services/user/getUser.js";

const quotationView = async (node, infoQuotation) => {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const uid = searchParams.get('uid');
    const resQueryUser = await getUser(uid);
    console.log(resQueryUser);

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
    console.log(element);
    element.products.forEach((producto) => {
      productos += `
            <tbody>
                <tr>
                <td>${producto.productName}</td>
                <td>${producto.selectedMoldeCode}</td>
                <td>
                    ${resQueryUser.currency === 'COP' ? 
                        `$ ${producto.unitPrice.toLocaleString()}` : 
                        `$ ${producto.unitPrice.toFixed(2).toLocaleString()}`}
                    </td>
                <td>${producto.quantity}</td>
                <td>
                    ${resQueryUser.currency === 'COP' ? 
                        `$ ${producto.linePrice.toLocaleString()}` : 
                        `$ ${producto.linePrice.toFixed(2).toLocaleString()}`}
                    </td>
                </tr>
            </tbody>
        `;
    });
    
    container.innerHTML += `
            <div class="quotatioview__section">
            <div class="quotatioview__actions">
                <div class="quotatioview__edit quotation--btn__new">Editar</div>
                <div class="quotation--btn__save quotation--btn__new quotation-hide">Guardar</div>
            </div>
            <span>Nombre del escenario:</span>
            <h2 class="quotatioview__title quotatioview__title--scenary">${element.name}</h2>
            <table class="quotatioview__table">
                ${table}
                ${productos}
            </table>
            <table class="quotatioview__table table__descuento">
            <hr>
            <thead>
                <tr>
                    <th>Descuento</th>
                    <th></th>
                    <th>Subtotal con Descuento</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><div class="quotatioview__discount">% ${element.discountPercent.toLocaleString()}</div></td>
                    <td></td>
                    <td>
                        <div class="quotatioview__withdiscount">
                        <span>$ </span>
                            ${resQueryUser.currency === 'COP' ? 
                                `${element.subtotalWithDiscount.toLocaleString()}` : 
                                `${element.subtotalWithDiscount.toFixed(2).toLocaleString()}`}
                        </div>
                    </td>
                    <td><span>$</span>${element.subtotalProducts}</td>
                </tr>
            </tbody>
            </table>
            <hr>
            <table class="quotatioview__table table__total">
            <thead>
                <tr>
                    <th>
                        <div class="quotatioview__iva">
                            <span>Total con IVA (19%)</span>
                            ${element.taxIVA !== 0 ? 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                        </div>    
                    </th>
                    <th>
                        <div class="quotatioview__valueTotal">
                        <span>$ </span>
                            ${resQueryUser.currency === 'COP' ? 
                                `${element.subtotalWithTaxIVA.toLocaleString()}` : 
                                `${element.subtotalWithTaxIVA.toFixed(2).toLocaleString()}`}
                            </div>
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
            const quotatioviewTitleScenary = section.querySelector('.quotatioview__title--scenary')
            let infoDiscuount = infoQuotation[i].discountPercent;
            const quotatioviewDiscount = section.querySelector('.quotatioview__discount')
            const quotationBtnSave = section.querySelector('.quotation--btn__save')
            const quotatioviewIva = section.querySelector('.quotatioview--iva')

            const inputNameScenary = `
            <input type="text" id="nameInput" class="nameInput" name="nameInput">
            `
            const inputEdit = `
            % <input type="number" id="rangeInput" class="rangeInput" name="rangeInput" min="0" max="10" step="1">
            `
            let inputInserted = false;
            quotatioviewEdit.addEventListener('click', () => {
                if (!inputInserted) {

                    const newNode = document.createElement('div');
                    newNode.classList.add('quotatioview__title')
                    newNode.innerHTML = inputNameScenary.trim();
                    
                    quotatioviewTitleScenary.parentNode.replaceChild(newNode, quotatioviewTitleScenary);
                    const nameInput = section.querySelector('.nameInput')
                    nameInput.value = infoQuotation[i].name
                    quotationBtnSave.classList.remove('quotation-hide')
                    quotatioviewDiscount.style.display = 'none';
                    quotatioviewDiscount.insertAdjacentHTML('afterend', inputEdit)
                    const rangeInput = section.querySelector('.rangeInput')

                    rangeInput.value = infoDiscuount
                    const quotatioviewWithdiscount = section.querySelector('.quotatioview__withdiscount')
                    const quotatioviewValueTotal = section.querySelector('.quotatioview__valueTotal')
                    quotatioviewIva.classList.remove('quotation-hide')

                    const mostrarEstadoCheckbox = (discountWithTotal) => {
                        if (quotatioviewIva.checked) {
                            console.log('ckech');
                            if(rangeInput.value == infoQuotation[i].discountPercent) {
                                quotatioviewValueTotal.innerHTML = resQueryUser.currency === 'COP' ? '$ ' + infoQuotation[i].subtotalWithTaxIVA.toLocaleString() : '$ ' + infoQuotation[i].subtotalWithTaxIVA.toFixed(2).toLocaleString()
                            } else {
                                console.log(discountWithTotal);
                                const calculateIva = discountWithTotal * infoQuotation[i].taxIVAApplied / 100
                                console.log(calculateIva);
                                const calculateIvaTotal = discountWithTotal + calculateIva
                                console.log(calculateIvaTotal);
                                quotatioviewValueTotal.innerHTML = resQueryUser.currency === 'COP' ? '$ ' + calculateIvaTotal.toLocaleString() : '$ ' + calculateIvaTotal.toFixed(2).toLocaleString()
                            }
                        } else {
                            console.log('no ckech', discountWithTotal);
                            if(rangeInput.value == infoQuotation[i].discountPercent) {
                                quotatioviewValueTotal.innerHTML = resQueryUser.currency === 'COP' ? '$ ' + infoQuotation[i].subtotalWithDiscount.toLocaleString() : '$ ' + infoQuotation[i].subtotalWithDiscount.toFixed(2).toLocaleString()
                            } else {
                                quotatioviewValueTotal.innerHTML = discountWithTotal
                            }
                        }
                    };
                    quotatioviewIva.addEventListener('change', () => {
                        resQueryUser.currency === 'COP' ?
                        mostrarEstadoCheckbox(parseInt(quotatioviewWithdiscount.textContent)) :
                        mostrarEstadoCheckbox(parseFloat(quotatioviewWithdiscount.textContent))
                    });

                    rangeInput.addEventListener('input', (event) => {
                        const maxValue = 10;
                        if (event.target.value > maxValue) {
                          event.target.value = maxValue;
                        }
                        if (event.target.value >= 0) {
                            const calculateDiscout = infoQuotation[i].subtotalProducts * event.target.value / 100
                            const calculateDiscoutTotal = infoQuotation[i].subtotalProducts - calculateDiscout
                            quotatioviewWithdiscount.innerHTML = resQueryUser.currency === 'COP' ? calculateDiscoutTotal.toLocaleString() : calculateDiscoutTotal.toFixed(2).toLocaleString()
                            mostrarEstadoCheckbox(calculateDiscoutTotal);
                        }
                    });
                    inputInserted = true;
                } 
            })

            if (quotationBtnSave) {
                quotationBtnSave.addEventListener('click', () => {
                    const putBodyScenary = {
                        "id": infoQuotation[i].id,
                        "name": nameInput.value,
                        "discountPercent": rangeInput.value,
                        "applyTaxIVA": quotatioviewIva.checked
                      }
                    console.log(putBodyScenary);
                    putScenario(putBodyScenary)
                })
            }
        });

};

export default quotationView;
