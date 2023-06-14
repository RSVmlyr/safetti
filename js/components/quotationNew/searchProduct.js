import createProductCards from "./createProductsCards.js";

const searchProduct = (quotationNew, resQueryProducts) => {

  console.log('Array para Filtrar: ', resQueryProducts.products);
  
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
    createProductCards(quotationNew, dataNames[0])

  });

}

export default searchProduct;