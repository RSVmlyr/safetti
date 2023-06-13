
import fillSelectProduct from "../../helpers/fillSelectProduct.js";
// import countryValidate from "./countryValidate.js";
import inputNumber from "./inputNumber.js";
import searchProduct from "./searchProduct.js";

const quotationNewPage = (quotationNew, resQueryUser, resQueryProducts) => {
  
  console.log('Object User', resQueryUser);
  console.log('Object Products', resQueryProducts.products);

  const idQnClient = quotationNew.querySelector('#qnclient')
  idQnClient.innerHTML = 'Cliente: ' + resQueryUser.fullName
  const idQnAdvisor = quotationNew.querySelector('#qnadvisor')
  idQnAdvisor.innerHTML = 'Asesor: ' + resQueryUser.advisorName
  const idQnCurrency = quotationNew.querySelector('#qncurrency')
  idQnCurrency.innerHTML = 'Modenda: ' + resQueryUser.currency

  const idQnCuentos = quotationNew.querySelector('#qncuentos')
  fillSelectProduct(idQnCuentos, resQueryProducts.cuentos)
  const idQnTiposPrenda = quotationNew.querySelector('#qntiposprenda')
  fillSelectProduct(idQnTiposPrenda, resQueryProducts.tiposPrenda)
  const idQnClasificaciones = quotationNew.querySelector('#qnclasificaciones')
  fillSelectProduct(idQnClasificaciones, resQueryProducts.clasificaciones)
  const idQnFitPrenda = quotationNew.querySelector('#qnfitprenda')
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
              <h3 class="card--title quotation--title__quo">${pro.id ? pro.id : ''} - ${pro.name ? pro.name : ''}</h3>
              <span class="card--reference">${pro.referencia ? pro.referencia : ''}</span>
              <span class="card--cuento quotation-hide">${pro.cuento ? pro.cuento : ''}</span>
              <span class="card--garment quotation-hide">${pro.garment ? pro.garment : ''}</span>
              <span class="card--classification quotation-hide">${pro.classification ? pro.classification : ''}</span>
              <span class="card--garmentfit quotation-hide">${pro.garmentFit ? pro.garmentFit : ''}</span>
              <p class="quotation--info">${description}</p>
            </div>
            <div class="card--actions">
              <button class="qnviewdetailproducts">Ver detalle</button>
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
      const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
  
      sliderProducts.insertAdjacentHTML('afterbegin', `${sliderRow}`)

      // Card button Agregar +
      const cardAddProducts = quotationNew.querySelector('.card .qnaddproducts')
      const sliderProductsRow = quotationNew.querySelector('.slider--productos .slider--content .slider--row')
      cardAddProducts.addEventListener('click', (e) => {
        // Delete other childs
        // const sliderProductsRows = quotationNew.querySelectorAll('.slider--productos .slider--content .slider--row')
        // sliderProductsRows.forEach(otherRow => {
        //   otherRow.classList.remove('active') 
        // });
        e.target ? sliderProductsRow.classList.add('active') : false
      })

      // Card button Cancelar
      const cardCancelProducts = quotationNew.querySelector('.card .qncancelproduct')
      cardCancelProducts.addEventListener('click', (e) => {
        if(e.target) {
          if (sliderProductsRow.classList.contains('active')) {
            sliderProductsRow.classList.remove('active')
          }
        }
      })

      const cardViewDetailProducts = quotationNew.querySelector('.card .qnviewdetailproducts')
      cardViewDetailProducts.addEventListener('click', (e) => {
        if(e.target) {
          let modalCard =
          `<div class="modal">
            <div class="modal--container">
              <div class="modal--header">
                <h3 class="quotation--title__quo">${pro.id ? pro.id : ''} / ${pro.name ? pro.name : ''}</h3>
              </div>
              <div class="modal--body">
                <div class="modal--body__content">
                  <h4 class="modal--title"><span>Deporte:</span> ${pro.cuento ? pro.cuento : ''}</h4>
                  <h4 class="modal--title"><span>Referencia:</span> ${pro.referencia ? pro.referencia : ''}</h4>
                  <h4 class="modal--title"><span>Clasificación:</span> ${pro.classification ? pro.classification : ''}</h4>
                  <h4 class="modal--title"><span>Descripción:</span></h4>
                  ${pro.description ? pro.description : ''}
                  <h4 class="modal--title"><span>Características:</span></h4>
                  ${pro.features ? pro.features : ''}
                </div>  
                <div class="modal--close">x</div>
              </div>
            </div>
          </div>
          `
          quotationNew.style.overflow = 'hidden'
          quotationNew.insertAdjacentHTML('afterend', `${modalCard}`)
          const modal = document.querySelector('.modal')
          const modalClose = document.querySelector('.modal--close')
          modalClose.addEventListener('click', () => {
            quotationNew.style.overflow = 'auto'
            modal.remove()  
          })
        }
      })
  
      const idQnCountry = quotationNew.querySelector('.qncountry')
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
  
      const qnManInput = quotationNew.querySelector('.qnManInput')
      inputNumber(qnManInput, '.qnManIncrease', '.qnManDecrease')
      const qnWomanInput = quotationNew.querySelector('.qnWomanInput')
      inputNumber(qnWomanInput, '.qnWomanIncrease', '.qnWomanDecrease')
      const qnUnisex = quotationNew.querySelector('.qnUnisexInput')
      inputNumber(qnUnisex, '.qnUnisexIncrease', '.qnUnisexDecrease')
      const qnJunior = quotationNew.querySelector('.qnJuniorInput')
      inputNumber(qnJunior, '.qnJuniorIncrease', '.qnJuniorDecrease')

      const inputMan = quotationNew.querySelector('.inputman')
      inputMan.id = `inputman--${index + 1}`;
      const inputwoman = quotationNew.querySelector('.inputwoman')
      inputwoman.id = `inputwoman--${index + 1}`;
      const inputUnisex = quotationNew.querySelector('.inputunisex')
      inputUnisex.id = `inputunisex--${index + 1}`;
      const inputJunior = quotationNew.querySelector('.inputjunior')
      inputJunior.id = `inputjunior--${index + 1}`;

      idQnCountry.addEventListener('change', (e) => {

        let idInputMan = quotationNew.querySelector(`#inputman--${index + 1}`);
        if (idInputMan.classList.contains('quotation-hidden')) {
          idInputMan.classList.remove('quotation-hidden')
        }  
        let idInputwoman = quotationNew.querySelector(`#inputwoman--${index + 1}`);
        if (idInputwoman.classList.contains('quotation-hidden')) {
          idInputwoman.classList.remove('quotation-hidden')
        }  
        let idInputUnisex = quotationNew.querySelector(`#inputunisex--${index + 1}`);
        if (idInputUnisex.classList.contains('quotation-hidden')) {
          idInputUnisex.classList.remove('quotation-hidden')
        }  
        let idInputJunior = quotationNew.querySelector(`#inputjunior--${index + 1}`);
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

    // Search Product
    searchProduct(quotationNew)
    // Search Product

  } else { 
    const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
    sliderProducts.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span class="quotation--title">No hay Productos...</span></div>')
  }

}

export default quotationNewPage