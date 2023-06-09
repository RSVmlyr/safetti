
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
// import countryValidate from "./countryValidate.js";
import inputNumber from "./inputNumber.js";

const quotationNewPage = (resQueryUser, resQueryProducts) => {
  
  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts.products);

  const idQnClient = document.querySelector('#qnclient')
  idQnClient.innerHTML = 'Cliente: ' + resQueryUser.fullName
  const idQnAdvisor = document.querySelector('#qnadvisor')
  idQnAdvisor.innerHTML = 'Asesor: ' + resQueryUser.advisorName
  const idQnCurrency = document.querySelector('#qncurrency')
  idQnCurrency.innerHTML = 'Modenda: ' + resQueryUser.currency

  const idQnCuentos = document.querySelector('#qncuentos')
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)
  const idQnTiposPrenda = document.querySelector('#qntiposprenda')
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)
  const idQnClasificaciones = document.querySelector('#qnclasificaciones')
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)
  const idQnFitPrenda = document.querySelector('#qnfitprenda')
  fillSelectProduct(idQnFitPrenda, resQueryProducts.fitPrenda)

  if (resQueryProducts.products.length > 0) {
    resQueryProducts.products.forEach((pro, index) => {

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
                 ${pro.id ? pro.id : ''} / ${pro.name ? pro.name : ''}
              </h3>
              <p class="quotation--info">${description}</p>
            </div>
            <div class="card--actions">
              <button>Ver detalle</button>
              <button class="qnaddproducts">Agregar +</button>
            </div>
          </div>
          <div class="card__back">
           <select class="qncountry card__back--country">
            <option value="" disabled selected>País</option>
           </select>
           <div id="card__back--items" class="card__back--items">
  
            <div class="inputman card--amount">
              <span class="card--amount__title">Hombre</span>
              <div class="card--amount__input">
                <button class="qnManDecrease">-</button>
                <input class="qnManInput" type="number" name="qnManInput" value="0" min="0" readonly>
                <button class="qnManIncrease">+</button>
              </div>
            </div>
  
            <div class="inputwoman card--amount">
              <span class="card--amount__title">Mujer</span>
              <div class="card--amount__input">
                <button class="qnWomanDecrease">-</button>
                <input class="qnWomanInput" type="number" name="qnWomanInput" value="0" min="0" readonly>
                <button class="qnWomanIncrease">+</button>
              </div>
            </div>
  
            <div class="inputunisex card--amount">
              <span class="card--amount__title">Unisex</span>
              <div class="card--amount__input">
                <button class="qnUnisexDecrease">-</button>
                <input class="qnUnisexInput" type="number" name="qnUnisexInput" value="0" min="0" readonly>
                <button class="qnUnisexIncrease">+</button>
              </div>
            </div>
  
            <div class="inputjunior card--amount">
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

      const cardAddProducts = document.querySelector('.card .qnaddproducts')
  
      const idQnCountry = document.querySelector('.qncountry')
      const countryName = ['Colombia', 'USA - Canada', 'vR7']
      fillSelectProduct(idQnCountry, countryName)
  
      // countryValidate
      // countryValidate
      // countryValidate

      if (pro.colombiaMan === null && pro.colombiaWoman === null && pro.colombiaUnisex === null && pro.colombiaJunior === null) {
        const optionToRemove = 'Colombia';
        const option = idQnCountry.querySelector(`option[value="${optionToRemove}"]`);
        option ? option.remove() : null
      }
      if (pro.canadaMan === null && pro.canadaWoman === null) {
        const optionToRemove = 'USA - Canada';
        const option = idQnCountry.querySelector(`option[value="${optionToRemove}"]`);
        option ? option.remove() : null
      }
      if (pro.vR7Man === null && pro.vR7Woman === null) {
        const optionToRemove = 'vR7';
        const option = idQnCountry.querySelector(`option[value="${optionToRemove}"]`);
        option ? option.remove() : null
      }
  
      const qnManInput = document.querySelector('.qnManInput')
      inputNumber(qnManInput, '.qnManIncrease', '.qnManDecrease')
      const qnWomanInput = document.querySelector('.qnWomanInput')
      inputNumber(qnWomanInput, '.qnWomanIncrease', '.qnWomanDecrease')
      const qnUnisex = document.querySelector('.qnUnisexInput')
      inputNumber(qnUnisex, '.qnUnisexIncrease', '.qnUnisexDecrease')
      const qnJunior = document.querySelector('.qnJuniorInput')
      inputNumber(qnJunior, '.qnJuniorIncrease', '.qnJuniorDecrease')

      const inputMan = document.querySelector('.inputman')
      inputMan.id = `inputman--${index + 1}`;
      const inputwoman = document.querySelector('.inputwoman')
      inputwoman.id = `inputwoman--${index + 1}`;
      const inputUnisex = document.querySelector('.inputunisex')
      inputUnisex.id = `inputunisex--${index + 1}`;
      const inputJunior = document.querySelector('.inputjunior')
      inputJunior.id = `inputjunior--${index + 1}`;

      idQnCountry.addEventListener('change', (e) => {

        let idInputMan = document.querySelector(`#inputman--${index + 1}`);
        if (idInputMan.classList.contains('quotation-hidden')) {
          idInputMan.classList.remove('quotation-hidden')
        }  
        let idInputwoman = document.querySelector(`#inputwoman--${index + 1}`);
        if (idInputwoman.classList.contains('quotation-hidden')) {
          idInputwoman.classList.remove('quotation-hidden')
        }  
        let idInputUnisex = document.querySelector(`#inputunisex--${index + 1}`);
        if (idInputUnisex.classList.contains('quotation-hidden')) {
          idInputUnisex.classList.remove('quotation-hidden')
        }  
        let idInputJunior = document.querySelector(`#inputjunior--${index + 1}`);
        if (idInputJunior.classList.contains('quotation-hidden')) {
          idInputJunior.classList.remove('quotation-hidden')
        }

        if (e.target.value === 'Colombia') {
          pro.colombiaMan === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.colombiaWoman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          pro.colombiaJunior === null ? idInputJunior.classList.add('quotation-hidden') : idInputJunior.classList.remove('quotation-hidden')
          pro.colombiaUnisex === null ? idInputUnisex.classList.add('quotation-hidden') : idInputUnisex.classList.remove('quotation-hidden')
        } else if (e.target.value === 'USA - Canada') {
          pro.canadaMan === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.canadaWoman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          idInputJunior.classList.add('quotation-hidden')
          idInputUnisex.classList.add('quotation-hidden')         
        } else if (e.target.value === 'vR7') {
          pro.vR7Man === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.vR7Woman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          idInputJunior.classList.add('quotation-hidden')
          idInputUnisex.classList.add('quotation-hidden')
        }

      })

    });
    
  } else { 
    const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
    sliderProducts.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span class="quotation--title">No hay Productos...</span></div>')
  }

}

export default quotationNewPage