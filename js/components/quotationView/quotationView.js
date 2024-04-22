import viewDetailQuatation from "../../helpers/viewDetailQuatation.js";
import formatCurrency from "../../helpers/formatCurrency.js";

const quotationView = async (node, quotation, infoQuotation) => {

    const container = document.createElement("div");
    container.classList.add("quotatioview--container");

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
                        <td id="product-molde" class="product-molde" data-molde="${producto.selectedMoldeCode}">${producto.selectedMoldeCode}</td>
                        <td>
                            <input type="text" value="$ ${formatCurrency(producto.unitPrice, quotation.currency)}" class="unit-value none" readonly />
                        </td>
                        <td>
                            <input type="number" value="${producto.quantity}" data-min-quantity="${producto.minQuantity}" class="quotatioview--quantity none" readonly />
                        </td>
                        <td class="sub-total">
                            <input type="text" value="$ ${formatCurrency(producto.linePrice, quotation.currency)}" data-value='${producto.linePrice}' class="none" readonly />
                        </td>
                    </tr>
                </tbody>
            `;
        });

        const discount = element.subtotalProducts - element.subtotalWithDiscount;

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
                                <input type="text" value='$ ${formatCurrency(element.subtotalProducts, quotation.currency)}' class="subtotal-products none" readonly />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="quotatioview__title--table">Descuento</span>
                                <span class="quotatioview__discount"><input type="number" min="0" max="100" value='${element.discountPercent}' class="quotatioview__discount none">%</span>
                            </td>
                            <td>
                                <input type="text" value='$ ${formatCurrency(discount, quotation.currency)}' class="quotatioview__discountValueNumber none">
                            </td>
                        </tr>
                        <tr>
                            <td class="quotatioview__title--table">Subtotal con descuento</td>
                            <td>
                                <input type="text" value='$ ${formatCurrency(element.subtotalWithDiscount, quotation.currency)}' class="quotatioview__withdiscount none">
                            </td>
                        </tr>
                        <tr class="iva__products">
                            <td class="quotatioview__title--table">IVA (19%)
                                ${element.taxIVA !== 0 ?
                `<input type="checkbox" class="quotatioview--iva quotation-hide" checked>` :
                `<input type="checkbox" class="quotatioview--iva quotation-hide">`}
                            </td>
                            <td>
                                <input type="text" value="$ ${formatCurrency(element.taxIVA, quotation.currency)}" class="iva__products-value none">
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
                            <input type="text" value="$ ${formatCurrency(element.subtotalWithTaxIVA, quotation.currency)}" class="quotatioview__valueTotal none">
                        </th>
                        <td></td>
                    </tr>
                </thead>
                </table>
            </div>
        `;
    });

    node.appendChild(container);
    viewDetailQuatation(quotation);
};

export default quotationView;