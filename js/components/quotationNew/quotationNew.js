
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
import countryValidate from "./countryValidate.js";
import inputNumber from "./inputNumber.js";

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

    // let mainImage = pro.mainImage;
    // const originUrlPath = 'https://dev-co-safetti-b2b.pantheonsite.io/sites/default/files/';
    // const modifiedStringImage = mainImage.replace('public://', originUrlPath);
    // console.log(modifiedStringImage);

    let sliderRow = 
    `<div class="slider--row">
      <div class="card">
        <div class="card__front">
          <div class="card--image">
            <img src="../img/icon/image-product.jpeg" loading="lazy" alt="Producto" title="Producto" >
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
        <div class="card__back">
         <select class="qncountry card__back--country">
          <option value="">País</option>
         </select>
         <div id="card__back--items" class="card__back--items">

          <div class="card--amount">
            <span class="card--amount__title">Hombre</span>
            <div class="card--amount__input">
              <button class="qnManDecrease">-</button>
              <input class="qnManInput" type="number" name="qnManInput" value="0" min="0" readonly>
              <button class="qnManIncrease">+</button>
            </div>
          </div>

          <div class="card--amount">
            <span class="card--amount__title">Mujer</span>
            <div class="card--amount__input">
              <button class="qnWomanDecrease">-</button>
              <input class="qnWomanInput" type="number" name="qnWomanInput" value="0" min="0" readonly>
              <button class="qnWomanIncrease">+</button>
            </div>
          </div>

          <div class="card--amount">
            <span class="card--amount__title">Unisex</span>
            <div class="card--amount__input">
              <button class="qnUnisexDecrease">-</button>
              <input class="qnUnisexInput" type="number" name="qnUnisexInput" value="0" min="0" readonly>
              <button class="qnUnisexIncrease">+</button>
            </div>
          </div>

          <div class="card--amount">
            <span class="card--amount__title">Junior</span>
            <div class="card--amount__input">
              <button class="qnJuniorDecrease">-</button>
              <input class="qnJuniorInput" type="number" name="qnJuniorInput" value="0" min="0" readonly>
              <button class="qnJuniorIncrease">+</button>
            </div>
          </div>

          <div class="card--amount__actions">
            <button class="qncancelproduct">Cancelar</button>
            <button class="qnaceptproduct">Aceptar</button>
          </div>

         </div>
        </div>
      </div>
    </div>
    `
    const sliderProducts = document.querySelector('.slider--productos .slider--content')

    sliderProducts.insertAdjacentHTML('afterbegin', `${sliderRow}`)

    const countryName = ['Colombia', 'USA - Canada', 'vR7']
    const idQnCountry = document.querySelector('.qncountry ')
    fillSelectProduct(idQnCountry, countryName)

    countryValidate(idQnCountry, pro.colombiaMan, pro.colombiaWoman, 'Colombia')
    countryValidate(idQnCountry, pro.canadaMan, pro.canadaWoman, 'USA - Canada')
    countryValidate(idQnCountry, pro.vR7Man, pro.vR7Woman, 'vR7')

    const qnManInput = document.querySelector('.qnManInput')
    inputNumber(qnManInput, '.qnManIncrease', '.qnManDecrease')
    const qnWomanInput = document.querySelector('.qnWomanInput')
    inputNumber(qnWomanInput, '.qnWomanIncrease', '.qnWomanDecrease')
    const qnUnisex = document.querySelector('.qnUnisexInput')
    inputNumber(qnUnisex, '.qnUnisexIncrease', '.qnUnisexDecrease')
    const qnJunior = document.querySelector('.qnJuniorInput')
    inputNumber(qnJunior, '.qnJuniorIncrease', '.qnJuniorDecrease')

  });

 

  

}

export default quotationNewPage