import getUser from "../services/user/getUser.js";
import getProductPrices from "../services/product/getProductPrices.js";
import getPriceInRange from "./getPriceInRange.js";
import ExpiringLocalStorage from "../components/localStore/ExpiringLocalStorage.js";
import nodeNotification from "./nodeNotification.js";
import formatCurrency from "./formatCurrency.js";
import onlyInputNumbers from "./onlyInputNumbers.js";

const inputQuantity = async (section, clienteID) => {
    const qnCurrency = document.querySelector('#qncurrency');
    const quotatioviewQuantity = section.querySelectorAll(".quotatioview--quantity");
    const client = await getInfoUser(clienteID);
    const quotatioviewValueTotal = section.querySelector(".quotatioview__valueTotal");
    const quotatioview__withdiscount = section.querySelector(".quotatioview__withdiscount");
    const ivaProductsValue = section.querySelector(".iva__products-value");
    const quotatioviewIva = section.querySelector('.quotatioview--iva');
    let currentPrices = [];

    const COP = value => currency(value, { symbol: "$ ", separator: ".", decimal:",", precision: 0 });
    const USD = value => currency(value, { symbol: "$ ", separator: ",", decimal:".", precision: 2 });
    const curr = value => qnCurrency.dataset.currency === "COP" ? COP(value) : USD(value);

    quotatioviewQuantity.forEach(async (item) => {
        let delayTimer;
        if (item.hasAttribute("readonly")) {
            item.removeAttribute("readonly");
            item.classList.remove("none");
        }

        item.onkeydown = onlyInputNumbers;

        item.addEventListener('input', async (event) => {
            const inputValue = event.target.value;
            const parentInfoName = event.target.closest('.info-name');
            clearTimeout(delayTimer);

            if (parentInfoName) {
                const productId = parentInfoName.getAttribute('data-product-id');

                delayTimer = setTimeout(async () => {
                    const minQuantity = item.dataset.minQuantity;
                    const quotationBtnSave = section.querySelector(".quotation--btn__save");

                    if(inputValue == ''){
                        const moldeCode = parentInfoName.querySelector('.product-molde').getAttribute('data-molde');
                        quotationBtnSave.disabled = true;
                        quotationBtnSave.classList.add("disabled");
                        event.target.setAttribute("data-valid", "false");
                        nodeNotification(`Ingrese una cantidad para el producto ${moldeCode}`);
                        return;
                    }

                    try {
                        const prices = await getServicePrices(productId, qnCurrency.dataset.currency, client.rol, currentPrices);
                        const validQuantity = ValidarVariosProd(section, prices, minQuantity);

                        if(validQuantity == -1){
                            quotationBtnSave.disabled = true;
                            quotationBtnSave.classList.add("disabled");
                            nodeNotification(`La cantidad total debe ser mayor o igual a ${minQuantity}`);
                            return;
                        }

                        let rawPrice = getPriceInRange(prices, validQuantity);

                        // Los precios están creados en COP, si la moneda actual es USD debemos formatearlo a USD
                        if(qnCurrency.dataset.currency === "USD"){
                            rawPrice = formatCurrency(currency(rawPrice, {separator:".", decimal:","}), "USD");
                        }

                        const priceUni = curr(rawPrice);
                        const subtotalProductsElement = section.querySelector('.subtotal-products');
                        const quotatioviewDiscountValueNumber = section.querySelector('.quotatioview__discountValueNumber');
                        const rangeInput = section.querySelector('#rangeInput');

                        //actualiza precio a productos del mismo grupo
                        const allProductMolde = section.querySelectorAll(".product-molde");
                        Array.from(allProductMolde).forEach(element => {
                            const referencia = element.dataset.molde;
                            const parentInfoName = element.closest(".info-name");
                    
                            if (prices.sku.includes(referencia)) {
                                const unitValueElement = parentInfoName.querySelector('.unit-value');
                                if (unitValueElement) {
                                    unitValueElement.value = priceUni.format();
                                }

                                const inputQuantity = parentInfoName.querySelector(".quotatioview--quantity")
                                const subTotal = priceUni.multiply(inputQuantity.value);
                                const subTotalElement = parentInfoName.querySelector('.sub-total input');
                                if (subTotalElement) {
                                    subTotalElement.value = subTotal.format();
                                }
                            }
                        });

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

                        const firstInvalid = event.target.closest('.quotatioview__table')
                            .querySelector('.quotatioview--quantity[data-valid="false"]');

                        if(!firstInvalid){
                            quotationBtnSave.classList.remove("disabled");
                            quotationBtnSave.disabled = false;
                        }
                    } catch (error) {
                        console.error('Error al obtener información de los productos:', error);
                    }
                }, 500);
            }
        });
    });

    return { msg: 'Vmlyr' };
}

const getServicePrices = async (productId, currency, rol, currentPrices) => {
    if(!rol){
        rol = "_final_consumer";
    }
    const prices = currentPrices.find(element => {
        return element.productId == productId &&
        element.currency == currency &&
        element.rol == rol});

    if(prices) {
        return prices;
    }
    else {
        const prices = await getProductPrices(productId, currency, rol);
        currentPrices.push(prices);
        return prices;
    }
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

const ValidarVariosProd = (section, prices, minQuantity) => {
    const allProductMolde = section.querySelectorAll(".product-molde");
    let totalQuantity = 0;
    let quantityElements = [];

    Array.from(allProductMolde).forEach(element => {
        const referencia = element.dataset.molde;
        const parentInfoName = element.closest(".info-name");

        if (prices.sku.includes(referencia)) {
            const quantityElement = parentInfoName.querySelector('.quotatioview--quantity');
            quantityElements.push(quantityElement);
            totalQuantity += parseInt(quantityElement.value);
        }
    });

    if(quantityElements.length > 0 && totalQuantity < minQuantity){
        quantityElements.forEach(element => {
            element.setAttribute("data-valid", "false");
        });
        return -1;
    }
    else{
        quantityElements.forEach(element => {
            element.setAttribute("data-valid", "true");
        });
    }

    return totalQuantity;
};

export default inputQuantity;