import createProductCards from "./createProductsCards.js";

const searchProduct = (quotationNew, resQueryUser, resQueryProducts) => {
  
  // Nombre / referencia
  const qnSearchProduct = quotationNew.querySelector('#qnsearchproduct')
  qnSearchProduct.addEventListener('input', (e) => {

    const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')
    const searchTerm = e.target.value.toLowerCase();
    const removerTildes = texto => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let names = resQueryProducts.products.filter(element => removerTildes(element.name).toLowerCase().includes(removerTildes(searchTerm)) || element.referencia.toLowerCase().includes(searchTerm))

    let dataNames = [{products:names}]
    sliderProductsRows.forEach(row => {
      row.remove()
    });
    createProductCards(quotationNew, resQueryUser ,dataNames[0])

  });

  const filterSelects = () => {

    const qnCuentos = quotationNew.querySelector('#qncuentos')
    let qnCuentosValue = qnCuentos.value.toLowerCase()

    const qnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
    let qnTiposPrendaValue = qnTiposPrenda.value.toLowerCase()

    const qnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
    let qnClasificacionesValue = qnClasificaciones.value.toLowerCase()

    const qnFitprenda = quotationNew.querySelector('#qnfitprenda')
    let qnFitprendaValue = qnFitprenda.value.toLowerCase()
 
    let filterPro = resQueryProducts.products.filter((pro) => (
      (qnCuentosValue === "" || pro.cuento.toLowerCase() === qnCuentosValue) &&
      (qnTiposPrendaValue === "" || pro.garment.toLowerCase() === qnTiposPrendaValue) &&
      (qnClasificacionesValue === "" || pro.classification.toLowerCase() === qnClasificacionesValue) &&
      (qnFitprendaValue === "" || pro.garmentFit.toLowerCase() === qnFitprendaValue)
    ));

    const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')

    let dataFilterPro = [{products:filterPro}]
    sliderProductsRows.forEach(row => {
      row.remove()
    });
    createProductCards(quotationNew, resQueryUser, dataFilterPro[0])
    localStorage.setItem("productosFiltrados", JSON.stringify(dataFilterPro[0]));

  }

  let selectCuento = quotationNew.querySelector('#qncuentos')
  let selectTipoPrenda = quotationNew.querySelector('#qntiposprenda')
  let selectClasificacion = quotationNew.querySelector('#qnclasificaciones')
  let selectPrenda = quotationNew.querySelector('#qnfitprenda')

  selectCuento.addEventListener('change', filterSelects)
  selectTipoPrenda.addEventListener('change', filterSelects)
  selectClasificacion.addEventListener('change', filterSelects)
  selectPrenda.addEventListener('change', filterSelects)

  const viewProducts = quotationNew.querySelector('#viewproducts');
  viewProducts.addEventListener('click', () => {
    var selects = document.querySelectorAll('select');
    selects.forEach(function(select) {
      select.selectedIndex = 0;
    });

    const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')
    sliderProductsRows.forEach(row => {
      row.remove()
    });
    createProductCards(quotationNew, resQueryUser, resQueryProducts);
    localStorage.removeItem("productosFiltrados");
    
  });
  
}

export default searchProduct;