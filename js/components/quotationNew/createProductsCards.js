import fillSelectProduct from "../../helpers/fillSelectProduct.js";
import getIamages from "../../services/iamges/getImages.js";
import dataSetQuotation from "./dataSetQuotation.js";
import inputNumber from "./inputNumber.js";
import localStorage from "./localStorage.js";
import QuotationCalculation from './QuotationCalculation.js';
import nodeNotification from '../../helpers/nodeNotification.js'
import qnaddproduct from "../../helpers/qnaddproduct.js"
import Login from "../../login/login.js";
import { config } from "../../../config.js"

const createProductCards = (quotationNew, resQueryUser, resQueryProducts) => {
  if(resQueryUser.rol != "advisors") {
    qnaddproduct()
  }
  const bodyDom = document.querySelector('body')

  dataSetQuotation(resQueryUser)

  const loading = quotationNew.querySelector('.slider--productos .slider--content .quotation--loading')
  loading ? loading.remove() : false

  function getFirstNonNullKey(obj) {
    const keysToCheck = ["colombiaJunior", "colombiaMan", "colombiaWoman", "colombiaUnisex", "canadaMan", "canadaWoman", "vR7Man", "vR7Woman"];
    for (const key of keysToCheck) {
      if (obj[key] !== null) {
        return key;
      }
    }
    return null;
  }
  if (resQueryProducts.products.length > 0) {

    resQueryProducts.products.forEach((pro, index) => {
      const firstNonNullKey = getFirstNonNullKey(pro);
      // Short description
      let description = pro.description ? pro.description.substring(0, 40) : '';
      if (pro.description && pro.description.length > 40) {
        description += '...';
      }
      // Short description+
      // Get URL Image
      let mainImage = pro.mainImage ? pro.mainImage : '../img/icon/image-product.jpg';
      const originUrlPath = config.API_DEV_IMAGE + '/sites/default/files/';
      let modifiedStringImage = mainImage.replace('public://', originUrlPath);
      modifiedStringImage = modifiedStringImage.replace(/ /g, '%20');   
            console.log(pro);
      let sliderRow = 
      `<div class="slider--row">
        <div class="card">
          <div class="card__front">
            <div class="card--image">
              <img src="${modifiedStringImage}" loading="lazy" alt="Producto" title="Producto" >
            </div>
            <div class="card--body">
              <h3 class="card--title quotation--title__quo">${pro.name ? pro.name : ''}</h3>
              <span class="card--reference">${pro.referencia ? pro.referencia : ''}</span>
              ${description}
            </div>
            <div class="card--actions">
              <button class="qnviewdetailproducts">Ver detalle</button>
              <button class="qnaddproducts add">Agregar +</button>
            </div>
          </div>
          <div class="card__back">
            <label for="">País:</label>
            <select id="" class="qncountry card__back--country">
              <option value="" selected>-- Seleccionar --</option>
            </select>
           <div id="card__back--items" class="card__back--items">
  
            <div class="inputman card--amount">
              <span class="card--amount__title">Hombre</span>
              <div class="card--amount__input">
                <button class="qnManDecrease">-</button>
                <input class="qnManInput colombiaMan" type="number" name="qnManInput" value="${'colombiaMan' === firstNonNullKey ? pro.minQuantity : 0}" min="0">
                <button class="qnManIncrease">+</button>
              </div>
            </div>
  
            <div class="inputwoman card--amount">
              <span class="card--amount__title">Mujer</span>
              <div class="card--amount__input">
                <button class="qnWomanDecrease">-</button>
                <input class="qnWomanInput colombiaWoman" type="number" name="qnWomanInput" value="${'colombiaWoman' === firstNonNullKey ? pro.minQuantity : 0}" min="0">
                <button class="qnWomanIncrease">+</button>
              </div>
            </div>
  
            <div class="inputunisex card--amount">
              <span class="card--amount__title">Unisex</span>
              <div class="card--amount__input">
                <button class="qnUnisexDecrease">-</button>
                <input class="qnUnisexInput colombiaUnisex" type="number" name="qnUnisexInput" value="${'colombiaUnisex' === firstNonNullKey ? pro.minQuantity : 0}" min="0">
                <button class="qnUnisexIncrease">+</button>
              </div>
            </div>
  
            <div class="inputjunior card--amount">
              <span class="card--amount__title">Junior</span>
              <div class="card--amount__input">
                <button class="qnJuniorDecrease">-</button>
                <input class="qnJuniorInput colombiaJunior" type="number" name="qnJuniorInput" value="${'colombiaJunior' === firstNonNullKey ? pro.minQuantity : 0}" min="0">
                <button class="qnJuniorIncrease">+</button>
              </div>
            </div>
  
            <div class="card--amount__actions">
              <button class="qncancelproduct">Cancelar</button>
              <button class="qnaceptproduct quotation-hidden">Agregar +</button>
            </div>
  
           </div>
          </div>
        </div>
      </div>
      `
      const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
  
      sliderProducts.insertAdjacentHTML('afterbegin', `${sliderRow}`)
      if(resQueryUser.rol ==="advisors") {
        qnaddproduct()
      }

      // Card button Agregar +
      const cardAddProducts = quotationNew.querySelector('.card .qnaddproducts')
      const sliderProductsRow = quotationNew.querySelector('.slider--productos .slider--content .slider--row')
      cardAddProducts.addEventListener('click', (e) => {
        e.target ? sliderProductsRow.classList.add('active') : false
        localStorage()
      })
      const button = quotationNew.querySelector('.qnaceptproduct');     
      button.addEventListener('click', (e) => {
        const parentElement = e.target.parentNode.parentNode;
        const countrySelect = parentElement.parentElement.querySelector('.card__back--country');
        const manInput = parentElement.querySelector('.qnManInput');
        const womanInput = parentElement.querySelector('.qnWomanInput');
        const unisexInput = parentElement.querySelector('.qnUnisexInput');
        const juniorInput = parentElement.querySelector('.qnJuniorInput');

        const product = [];
        if (manInput.value > 0) {
          product.push({
            country: countrySelect.value,
            id: pro.id,
            productName: pro.name,
            selectedMoldeCode: pro[countrySelect.value + 'Man'],
            quantity: manInput.value,
            minQuantity: pro.minQuantity
          });
        }
        
        if (womanInput.value > 0) {
          product.push({
            country: countrySelect.value,
            id: pro.id,
            productName: pro.name,
            selectedMoldeCode: pro[countrySelect.value + 'Woman'],
            quantity: womanInput.value,
            minQuantity: pro.minQuantity
          });
        }
        
        if (unisexInput.value > 0) {
          product.push({
            country: countrySelect.value,
            id: pro.id,
            productName: pro.name,
            selectedMoldeCode: pro[countrySelect.value + 'Unisex'],
            quantity: unisexInput.value,
            minQuantity: pro.minQuantity
          });
        }
        
        if (juniorInput.value > 0) {
          product.push({
            country: countrySelect.value,
            id: pro.id,
            productName: pro.name,
            selectedMoldeCode: pro[countrySelect.value + 'Junior'],
            quantity: juniorInput.value,
            minQuantity: pro.minQuantity
          });
        }

        setTimeout(() => {
          manInput.value = 0
          womanInput.value = 0
          unisexInput.value = 0
          juniorInput.value = 0
          sliderProductsRow.classList.remove('active')
        }, 1000);        
        if(product.length <= 0) {
          nodeNotification(`Las cantidad debe ser mayor o igual a ${minQuantity}`)
        }
        const sumaPorId = {};
        console.log(sumaPorId);
        product.forEach(p => {
          const { id, quantity, minQuantity, productName } = p;
          console.log(id);
          if (!sumaPorId[id]) {
            sumaPorId[id] = 0;
          }
          sumaPorId[id] += parseInt(quantity);
          console.log(quantity);
          console.log(sumaPorId[id]);

          if (sumaPorId[id] < minQuantity) {
            nodeNotification(`Las cantidad debe ser mayor o igual a ${minQuantity}`)
          } else {
            const quotationCalculation = new QuotationCalculation(resQueryUser);
            quotationCalculation.createArrayProducto(product);
            nodeNotification('Agregando producto a la lista...')
          }
        });
      });
  
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
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Agrega un desplazamiento suave
        });
        bodyDom.style.overflow = 'hidden'
        if(e.target) {
          let modalCard =
          `<div class="modal">
            <div class="modal--container">
              <div class="modal--container__body">
                <div class="modal--container__bodyLeft"></div>
                <div class="modal--container__bodyRight">
                  <div class="modal--header">
                    <div class="modal--header__languages">
                      <div class="es quotation--btn__new" style="background-color: black; color: white;">ES</div>
                      <div class="en quotation--btn__add">EN</div>
                    </div>
                    <h3 class="quotation--title__quo">${pro.id ? pro.id : ''} / ${pro.name ? pro.name : ''}</h3>
                  </div>
                  <div class="modal--body">
                    <div class="modal--body__content">
                      <h4 class="modal--title"><span>Deporte:</span> ${pro.cuento ? pro.cuento : ''}</h4>
                      <h4 class="modal--title"><span>Referencia:</span> ${pro.referencia ? pro.referencia : ''}</h4>
                      <h4 class="modal--title"><span>Clasificación:</span> ${pro.classification ? pro.classification : ''}</h4>
                      <h4 class="modal--title"><span class="des-es">Descripción:</span><span class="des-en quotation-hide">Description:</span></h4>
                      <div class="modal--des__es">
                        ${pro.description ? pro.description : '...'}
                      </div>
                      <div class="modal--des__en quotation-hide">
                        ${pro.descriptionEN ? pro.descriptionEN : '...'}
                      </div>
                      <h4 class="modal--title"><span class="car-es">Características:</span><span class="car-en quotation-hide">Features:</span></h4>
                      <div class="modal--features__es">
                        ${pro.features ? pro.features : '...'}
                      </div>
                      <div class="modal--features__en quotation-hide">
                        ${pro.featuresEN ? pro.featuresEN : '...'}
                      </div>
                    </div>  
                    <div class="modal--close">x</div>
                  </div>
                </div>
              </div>  
            </div>
          </div>
          `
          quotationNew.style.overflow = 'hidden'
          quotationNew.insertAdjacentHTML('afterend', `${modalCard}`)
          const modal = document.querySelector('.modal')
          const modalClose = document.querySelector('.modal--close')
          modalClose.addEventListener('click', () => {
            bodyDom.style.overflow = 'initial'
            quotationNew.style.overflow = 'auto'
            modal.remove()  
          })

          const btnEs = document.querySelector('.es')
          const btnEn = document.querySelector('.en')
          const modalDesEs = document.querySelector('.modal--des__es')
          const modalFeaturesEs = document.querySelector('.modal--features__es')
          const modalDesEn = document.querySelector('.modal--des__en')
          const modalFeaturesEn = document.querySelector('.modal--features__en')
          const desEs = document.querySelector('.des-es')
          const desEn = document.querySelector('.des-en')
          const carEs = document.querySelector('.car-es')
          const carEn = document.querySelector('.car-en')
          
          btnEs.addEventListener('click', () => {
            btnEs.style.backgroundColor = 'black';
            btnEs.style.color = 'white';
            btnEn.style.backgroundColor = 'transparent';
            btnEn.style.color = 'black';
            desEs.classList.remove('quotation-hide')
            desEn.classList.add('quotation-hide')
            carEs.classList.remove('quotation-hide')
            carEn.classList.add('quotation-hide')
            modalDesEn.classList.add('quotation-hide')
            modalFeaturesEn.classList.add('quotation-hide')
            modalDesEs.classList.remove('quotation-hide')
            modalFeaturesEs.classList.remove('quotation-hide')
          })
          btnEn.addEventListener('click', () => {
            btnEn.style.backgroundColor = 'black';
            btnEn.style.color = 'white';
            btnEs.style.backgroundColor = 'white';
            btnEs.style.color = 'black';
            desEs.classList.add('quotation-hide')
            desEn.classList.remove('quotation-hide')
            carEs.classList.add('quotation-hide')
            carEn.classList.remove('quotation-hide')
            modalDesEs.classList.add('quotation-hide')
            modalFeaturesEs.classList.add('quotation-hide')
            modalDesEn.classList.remove('quotation-hide')
            modalFeaturesEn.classList.remove('quotation-hide')
          })

          const imagesData = async () => {

            const containerLeft = document.querySelector('.modal--container__bodyLeft')

            const spinnerImages = document.createElement('img')
            spinnerImages.classList.add('qnimage--auto')
            spinnerImages.src = '../img/icon/icon-spinner.gif'
            containerLeft.insertAdjacentElement('afterbegin', spinnerImages);
            // Get Images|
            let idProduct = pro.id
            const resQueryImages = await getIamages(idProduct)
            spinnerImages.remove()
    
            if (resQueryImages.length > 0) {
              resQueryImages.forEach(e => {

                // Get URL Image
                let mainImage = e.imageUrl ? e.imageUrl : '../img/icon/image-product.jpg'
                const originUrlPath = config.API_DEV_IMAGE + '/sites/default/files/';
                let modifiedStringImage = mainImage.replace('public://', originUrlPath);
                modifiedStringImage = modifiedStringImage.replace(/ /g, '%20');
                const image = document.createElement('img')
                image.src = modifiedStringImage
                image.setAttribute('loading', 'lazy')
                image.setAttribute('alt', 'Safetti')
                image.setAttribute('title', 'Safetti')
                containerLeft.insertAdjacentElement('afterbegin', image);
              });
            } else {
              const imageEmpty = document.createElement('img')
              imageEmpty.classList.add('qnimage--auto')
              imageEmpty.src = '../img/icon/image-product.jpg'
              imageEmpty.setAttribute('alt', 'Safetti')
              imageEmpty.setAttribute('title', 'Safetti')
              containerLeft.insertAdjacentElement('afterbegin', imageEmpty);
            }
          }
          imagesData()
        }
      })
  
      const idQnCountry = quotationNew.querySelector('.qncountry')
      const countryName = ['colombia', 'canada', 'vR7']
      fillSelectProduct(idQnCountry, countryName)

      if (pro.colombiaMan === null && pro.colombiaWoman === null && pro.colombiaUnisex === null && pro.colombiaJunior === null) {
        const optionToRemove = 'colombia';
        const option = idQnCountry.querySelector(`option[value="${optionToRemove}"]`);
        option ? option.remove() : null
      }
      if (pro.canadaMan === null && pro.canadaWoman === null) {
        const optionToRemove = 'canada';
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
      let idInputMan = quotationNew.querySelector(`#inputman--${index + 1}`);
      const amountM = idInputMan.querySelector('.card--amount__input')
      amountM.classList.add('quotation-hidden')

      const inputwoman = quotationNew.querySelector('.inputwoman')
      inputwoman.id = `inputwoman--${index + 1}`;
      let idInputwoman = quotationNew.querySelector(`#inputwoman--${index + 1}`);
      const amountW = idInputwoman.querySelector('.card--amount__input')
      amountW.classList.add('quotation-hidden')

      const inputUnisex = quotationNew.querySelector('.inputunisex')
      inputUnisex.id = `inputunisex--${index + 1}`;
      let idInputUnisex = quotationNew.querySelector(`#inputunisex--${index + 1}`);
      const amountU = idInputUnisex.querySelector('.card--amount__input')
      amountU.classList.add('quotation-hidden')

      const inputJunior = quotationNew.querySelector('.inputjunior')
      inputJunior.id = `inputjunior--${index + 1}`;
      let idInputJunior = quotationNew.querySelector(`#inputjunior--${index + 1}`);
      const amountJ = idInputJunior.querySelector('.card--amount__input')
      amountJ.classList.add('quotation-hidden')

      const qnaceptProduct = quotationNew.querySelector('.qnaceptproduct')

      idQnCountry.addEventListener('change', (e) => {
        amountM.classList.remove('quotation-hidden')
        amountW.classList.remove('quotation-hidden')
        amountU.classList.remove('quotation-hidden')
        amountJ.classList.remove('quotation-hidden')
        
        if (idInputMan.classList.contains('quotation-hidden')) {
          idInputMan.classList.remove('quotation-hidden')
        }  
        
        if (idInputwoman.classList.contains('quotation-hidden')) {
          idInputwoman.classList.remove('quotation-hidden')
        }  
        
        if (idInputUnisex.classList.contains('quotation-hidden')) {
          idInputUnisex.classList.remove('quotation-hidden')
        }  
        
        if (idInputJunior.classList.contains('quotation-hidden')) {
          idInputJunior.classList.remove('quotation-hidden')
        }

        if (e.target.value === 'colombia') {
          pro.colombiaMan === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.colombiaWoman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          pro.colombiaJunior === null ? idInputJunior.classList.add('quotation-hidden') : idInputJunior.classList.remove('quotation-hidden')
          pro.colombiaUnisex === null ? idInputUnisex.classList.add('quotation-hidden') : idInputUnisex.classList.remove('quotation-hidden')
          qnaceptProduct.classList.remove('quotation-hidden')
        } else if (e.target.value === 'canada') {
          pro.canadaMan === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.canadaWoman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          idInputJunior.classList.add('quotation-hidden')
          idInputUnisex.classList.add('quotation-hidden')
          qnaceptProduct.classList.remove('quotation-hidden') 
        } else if (e.target.value === 'vR7') {
          pro.vR7Man === null ? idInputMan.classList.add('quotation-hidden') : idInputMan.classList.remove('quotation-hidden')
          pro.vR7Woman === null ? idInputwoman.classList.add('quotation-hidden') : idInputwoman.classList.remove('quotation-hidden')
          idInputJunior.classList.add('quotation-hidden')
          idInputUnisex.classList.add('quotation-hidden')
          qnaceptProduct.classList.remove('quotation-hidden')
        } else {
          amountM.classList.add('quotation-hidden')
          amountW.classList.add('quotation-hidden')
          amountU.classList.add('quotation-hidden')
          amountJ.classList.add('quotation-hidden')
          qnaceptProduct.classList.add('quotation-hidden')
        }

      })

    });

  } else {
    const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
    sliderProducts.insertAdjacentHTML('afterbegin', '<div class="quotation--loading"><span class="quotation--title">No hay Productos...</span></div>')  
  }

}

export default createProductCards