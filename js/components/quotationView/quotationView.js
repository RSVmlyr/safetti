import currencyFormatUSD from "../../helpers/currencyFormatUSD.js";
import inputQuantity from "../../helpers/inputQuantity.js";
import nodeNotification from "../../helpers/nodeNotification.js";
import putScenario from "../../services/quotation/putScenario.js";
import getUser from "../../services/user/getUser.js";
import getConfigCurrency from "../../helpers/getConfigCurrency.js";
import viewDetailQuatation from "../../helpers/viewDetailQuatation.js";
import formatNumberWithPoints from "../../helpers/formatNumberWithPoints.js";

const quotationView = async (node, quotation ,infoQuotation) => {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const currency = quotation.currency
    localStorage.setItem('Currency', currency)

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

        const pUnitPrice = producto.unitPrice
        const pLinePrice = producto.linePrice
    
      productos += `
            <tbody>
                <tr class="info-name" data-product-id="${producto.product}">
                    <td>${producto.productName}</td>
                    <td id="product-molde">${producto.selectedMoldeCode}</td>
                    <td>
                        $ <input type="text" value="${formatNumberWithPoints(pUnitPrice)}" class="unit-value none" readonly />
                    </td>
                    <td>
                        <input type="number" value="${producto.quantity}" data-min-quantity="${producto.minQuantity}" class="quotatioview--quantity none" readonly />
                    </td>
                    <td class="sub-total">
                        $ <input type="text" value="${formatNumberWithPoints(pLinePrice)}" data-value='${pLinePrice}' class="none" readonly />
                    </td>
                </tr>
            </tbody>
        `;
        });

        const sProducts = element.subtotalProducts
        const sWithDiscount = element.subtotalWithDiscount
        const dPercen = element.discountPercent
        const discount = element.subtotalProducts - element.subtotalWithDiscount
        const tIva = element.taxIVA
        const sWithIva = element.subtotalWithTaxIVA

        container.innerHTML += `
            <div class="quotatioview__section">
                <div class="quotatioview__actions">
                    <div class="quotatioview__edit quotation--btn__new">Editar</div>
                    <button class="quotation--btn__save quotation--btn__new quotation-hide">Guardar</button>
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
                                <span>$</span> 
                                <input type="text" value='${formatNumberWithPoints(sProducts)}' class="subtotal-products none" readonly />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="quotatioview__title--table">Descuento</span>
                                <span class="quotatioview__discount"><input type="text" value='${dPercen}' class="quotatioview__discount none"> %</span>
                            </td>
                            <td>
                                <span>$</span>
                                <span>-</span>
                                <input type="text" value='${formatNumberWithPoints(discount)}' class="quotatioview__discountValueNumber none">
                            </td>
                        </tr>
                        <tr>
                            <td class="quotatioview__title--table">Subtotal con descuento</td>
                            <td>
                                <span>$</span>
                                <input type="text" value='${formatNumberWithPoints(sWithDiscount)}' class="quotatioview__withdiscount none">
                            </td>
                        </tr>
                        <tr class="iva__products">
                            <td class="quotatioview__title--table">IVA (19%)
                                ${tIva !== 0 ? 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                                `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                            </td>
                            <td>
                                <span>$</span>
                                <input type="text" value="${formatNumberWithPoints(tIva)}" class="iva__products-value none">
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
                                ${tIva !== 0 ? 
                                    `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` : 
                                    `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                            </div>
                        </th>
                        <th>
                            <span>Total:</span>
                            <span>$</span>
                            <input type="text" value="${formatNumberWithPoints(sWithIva)}" class="quotatioview__valueTotal none">
                        </th>
                        <td></td>
                    </tr>
                </thead>
                </table>
            </div>
        `;
    });
    node.appendChild(container);

    viewDetailQuatation(quotation, infoQuotation)
    
};

export default quotationView;
