import createProductCards from "./createProductsCards.js";
import qnaddproduct from "../../helpers/qnaddproduct.js";
import { getTranslation, loadTranslations } from "../../lang.js";

const searchProduct = async (quotationNew, resQueryUser, resQueryProducts) => {

    // Nombre / referencia
    const qnSearchProduct = quotationNew.querySelector('#qnsearchproduct');

    qnSearchProduct.addEventListener('input', async (e) => {
        qnaddproduct();
        const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row');
        const searchTerm = e.target.value.toLowerCase();
        const removerTildes = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let searchProducts = resQueryProducts.products.filter(element =>
            removerTildes(element.name).toLowerCase().includes(removerTildes(searchTerm)) ||
            (element.nameEN && removerTildes(element.nameEN).toLowerCase().includes(removerTildes(searchTerm))) ||
            element.referencia.toLowerCase().includes(searchTerm));

        sliderProductsRows.forEach(row => {
            row.remove();
        });

        await createProductCards(quotationNew, resQueryUser, { products: searchProducts });
        await loadTranslations();
    });

    const filterSelects = async (e) => {
        const qnCuentos = quotationNew.querySelector('#qncuentos');
        const qnTiposPrenda = quotationNew.querySelector('#qntiposprenda');
        const qnClasificaciones = quotationNew.querySelector('#qnclasificaciones');
        const qnFitprenda = quotationNew.querySelector('#qnfitprenda');
        const tooltip = quotationNew.querySelector('.quotationew__tooltip');
        tooltip.style.display = "none";

        if (e.target == qnCuentos) {
            qnClasificaciones.selectedIndex = 0;
            qnTiposPrenda.selectedIndex = 0;
            qnFitprenda.selectedIndex = 0;

            Array.from(qnClasificaciones.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
            Array.from(qnTiposPrenda.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
            Array.from(qnFitprenda.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
        }

        if (e.target == qnClasificaciones) {
            qnTiposPrenda.selectedIndex = 0;
            qnFitprenda.selectedIndex = 0;
            Array.from(qnTiposPrenda.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
            Array.from(qnFitprenda.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
        }

        if (e.target == qnTiposPrenda) {
            qnFitprenda.selectedIndex = 0;
            Array.from(qnFitprenda.options).forEach(function (option) {
                if (option.value !== "") {
                    option.hidden = true;
                }
            });
        }

        let qnCuentosValue = qnCuentos.value.toLowerCase();
        let qnTiposPrendaValue = qnTiposPrenda.value.toLowerCase();
        let qnClasificacionesValue = qnClasificaciones.value.toLowerCase();
        let qnFitprendaValue = qnFitprenda.value.toLowerCase();

        let filteredProducts = { products: [] };

        filteredProducts.products = resQueryProducts.products.filter((pro) => (
            (qnCuentosValue === "" || pro.cuento.toLowerCase() === qnCuentosValue) &&
            (qnTiposPrendaValue === "" || pro.garment.toLowerCase() === qnTiposPrendaValue) &&
            (qnClasificacionesValue === "" || pro.classification.toLowerCase() === qnClasificacionesValue) &&
            (qnFitprendaValue === "" || pro.garmentFit.toLowerCase() === qnFitprendaValue)
        ));

        if (e.target == qnCuentos && qnCuentosValue !== "") {
            Array.from(qnClasificaciones.options).forEach(async function (option) {
                if (option.value !== "") {
                    const count = filteredProducts.products.filter(pro => pro.classification === option.value).length;
                    if (count == 0) {
                        option.hidden = true;
                    }
                    else {
                        option.hidden = false;
                        option.text = `${ await getTranslation(option.value) } (${count})`;
                    }
                }
            });
        }

        if (e.target == qnClasificaciones && qnClasificacionesValue !== "") {
            Array.from(qnTiposPrenda.options).forEach(async function (option) {
                if (option.value !== "") {
                    const count = filteredProducts.products.filter((pro) => pro.garment === option.value).length;
                    if (count == 0) {
                        option.hidden = true;
                    }
                    else {
                        option.hidden = false;
                        option.text = `${ await getTranslation(option.value) } (${count})`;
                    }
                }
            });
        }

        if (e.target == qnTiposPrenda && qnTiposPrendaValue !== "") {
            Array.from(qnFitprenda.options).forEach(async function (option) {
                if (option.value !== "") {
                    const count = filteredProducts.products.filter((pro) => pro.garmentFit === option.value).length;
                    if (count == 0) {
                        option.hidden = true;
                    }
                    else {
                        option.hidden = false;
                        option.text = `${ await getTranslation(option.value) } (${count})`;
                    }
                }
            });
        }

        if(e.target == qnFitprenda) {
            if(qnFitprendaValue === "slim") {
                tooltip.style.display = "block";
                const tooltipText = quotationNew.querySelector('.quotationew__tooltiptext');
                tooltipText.innerHTML = `<strong>Slim FIT:</strong> ${ await getTranslation("slim_fit_description") }`;
            }

            if(qnFitprendaValue === "regular") {
                tooltip.style.display = "block";
                const tooltipText = quotationNew.querySelector('.quotationew__tooltiptext');
                tooltipText.innerHTML = `<strong>Regular FIT:</strong> ${ await getTranslation("regular_fit_description") }`;
            }
        }

        const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row');
        sliderProductsRows.forEach(row => {
            row.remove();
        });

        await createProductCards(quotationNew, resQueryUser, filteredProducts);
        await loadTranslations();
        localStorage.setItem("productosFiltrados", JSON.stringify(filteredProducts));
    }

    let selectCuento = quotationNew.querySelector('#qncuentos');
    let selectTipoPrenda = quotationNew.querySelector('#qntiposprenda');
    let selectClasificacion = quotationNew.querySelector('#qnclasificaciones');
    let selectPrenda = quotationNew.querySelector('#qnfitprenda');

    selectCuento.addEventListener('change', filterSelects);
    selectTipoPrenda.addEventListener('change', filterSelects);
    selectClasificacion.addEventListener('change', filterSelects);
    selectPrenda.addEventListener('change', filterSelects);

    const viewProducts = quotationNew.querySelector('#viewproducts');

    viewProducts.addEventListener('click', async () => {
        qnSearchProduct.value = "";
        let selects = document.querySelectorAll('select');
        selects.forEach(function(select) {
            select.selectedIndex = 0;

            if (select.id != "qncuentos") {
                Array.from(select.options).forEach(function (option) {
                    if (option.value !== "") {
                        option.hidden = true;
                    }
                });
            }
        });

        const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row');

        sliderProductsRows.forEach(row => {
            row.remove();
        });

        await createProductCards(quotationNew, resQueryUser, resQueryProducts);
        await loadTranslations();
        localStorage.removeItem("productosFiltrados");
    });
}

export default searchProduct;