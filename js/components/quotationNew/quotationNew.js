import fillSelectProduct from "../../helpers/fillSelectProduct.js";

const quotationNewPage = (resQueryUser, resQueryProducts) => {

  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts);

  // #qncuentos
  const idQnCuentos = document.querySelector('#qncuentos')
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)

  // $qntiposPrende
  const idQnTiposPrenda = document.querySelector('#qntiposprenda')
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)

  // #qnclasificaciones
  const idQnClasificaciones = document.querySelector('#qnclasificaciones')
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)

  // #qnfitprenda
  const idQnFitPrenda = document.querySelector('#qnfitprenda')
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda)

  resQueryProducts.products.forEach(pro => {
    console.log();

    let sliderRow = 
    `<div class="slider--row">
      <div class="card">
        <div class="card--image">
          <img src="./img/icon/image-product.jpeg" loading="lazy" alt="image" title="image" >
        </div>
        <div class="card--body">
          <h3 class="card--title quotation--title__quo">
            ${pro.name ? pro.name : ''}
          </h3>
          <p>${pro.description ? pro.description : ''}</p>
        </div>
        <div class="card--actions">
          <button>Ver detalle</button>
          <a href="">Agregar +</a>
        </div>
      </div>
    </div>
    `
    const sliderProducts = document.querySelector('.slider--productos .slider--content')

    sliderProducts.insertAdjacentHTML('afterbegin', `${sliderRow}`)

  });

}

export default quotationNewPage