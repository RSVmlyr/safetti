import fillSelectProduct from "../../helpers/fillSelectProduct.js";

const quotationNewPage = (resQueryUser, resQueryProducts) => {
  

  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts);

  const idQnClient = document.querySelector('#qnclient')
  idQnClient.innerHTML = 'Cliente: ' + resQueryUser.fullName
  
  const idQnAdvisor = document.querySelector('#qnadvisor')
  idQnAdvisor.innerHTML = 'Asesor: ' + resQueryUser.advisorName

  const idQnCurrency = document.querySelector('#qncurrency')
  idQnCurrency.innerHTML = 'Modenda: ' + resQueryUser.currency


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

    // Short description
    let description = pro.description ? pro.description.substring(0, 40) : '';
    if (pro.description && pro.description.length > 40) {
      description += '...';
    }
    // Short description

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
          <p class="quotation--info">${description}</p>
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