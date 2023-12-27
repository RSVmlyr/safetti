import getUser from "../services/user/getUser.js"
import getProductPrices from "../services/product/getProductPrices.js"
import getPriceInRange from "./getPriceInRange.js"
import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js"
import nodeNotification from "./nodeNotification.js";
import formatCurrency from "./formatCurrency.js"

const inputQuantity = async (section, clienteID) => {
    const quotatioviewQuantity = section.querySelectorAll(".quotatioview--quantity")
    const client = await getInfoUser(clienteID);
    const quotatioviewValueTotal = section.querySelector(".quotatioview__valueTotal")
    const quotatioview__withdiscount = section.querySelector(".quotatioview__withdiscount")
    const ivaProductsValue = section.querySelector(".iva__products-value")
    const quotatioviewIva = section.querySelector('.quotatioview--iva');

    const COP = value => currency(value, { symbol: "$ ", separator: ".", decimal:",", precision: 0 });
    const USD = value => currency(value, { symbol: "$ ", separator: ",", decimal:".", precision: 2 });
    const curr = value => client.currency === "COP" ? COP(value) : USD(value);

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
                    const res = ValidarVariosProd(section, item, minQuantity);

                    if (inputValue != '' && inputValue < parseInt(minQuantity) && res != true) {
                        quotationBtnSave.disabled = true
                        nodeNotification(`Las cantidad debe ser mayor o igual a ${minQuantity}`)
                        return
                    } else {
                        quotationBtnSave.disabled = false
                    }
                    try {
                        const prices = await getServicePrices(productId, client);
                        let rawPrice = getPriceInRange(prices, inputValue);

                        // Los precios están creados en COP, si la moneda actual es USD debemos formatearlo a USD
                        if(client.currency === "USD"){
                            rawPrice = formatCurrency(currency(rawPrice, {separator:".", decimal:","}), "USD");
                        }

                        const priceUni = curr(rawPrice);
                        const subtotalProductsElement = section.querySelector('.subtotal-products');
                        const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber');
                        const rangeInput = section.querySelector('#rangeInput');

                        const SubTotal = priceUni.multiply(inputValue);
                        const row = parentInfoName;
                        const unitValueElement = row.querySelector('.unit-value');

                        if (unitValueElement) {
                            unitValueElement.value = priceUni.format();
                        }
                        const subTotalElement = row.querySelector('.sub-total input');
                        if (subTotalElement) {
                            subTotalElement.value = SubTotal.format();
                        }

                        const subTotalElements = section.querySelectorAll('.sub-total input');
                        let totalSum = curr(0);
                        
                        subTotalElements.forEach((element) => {
                            totalSum = totalSum.add(element.value);
                        });

                        if (subtotalProductsElement) {
                            subtotalProductsElement.value = totalSum.format();
                        }
                        if (rangeInput) {
                            const event = new Event('input');
                            rangeInput.dispatchEvent(event);
                        }

                        // Subtotal con descuento
                        const subTotalValue = totalSum.subtract(quotatioviewDiscountValueNumber.value);
                        if (quotatioview__withdiscount) {
                            quotatioview__withdiscount.value = subTotalValue.format();
                        }
                        // Subtotal con descuento

                        // IVA
                        if (quotatioviewIva.checked && ivaProductsValue) {
                            ivaProductsValue.value = subTotalValue.multiply(0.19).format();
                        }
                        // IVA

                        // Total
                        const Total = subTotalValue.add(ivaProductsValue.value);
                        quotatioviewValueTotal.value = Total.format();
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

const getServicePrices = async (productId, client) => {
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

const ValidarVariosProd = (section, item, minQuantity) => {
    const parentInfoName = item.closest(".info-name");
    const itemMolde = parentInfoName.querySelector(".product-molde").dataset.molde.substring(0, 3);
    const allProductMolde = section.querySelectorAll(".product-molde");
    let totalQuantity = 0;
    Array.from(allProductMolde).forEach((element, index) => {
        const referencia = element.dataset.molde;
        const parentInfoName = element.closest(".info-name");
        if (referencia && referencia.startsWith(itemMolde)) {
            const quantityElement = parentInfoName.querySelector('.quotatioview--quantity');
            const quantity = quantityElement ? parseInt(quantityElement.value, 10) : 0;
            totalQuantity += quantity;
        }
    });

    return totalQuantity >= minQuantity;
};

export default inputQuantity;