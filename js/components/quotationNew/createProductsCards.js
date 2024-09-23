import getImages from "../../services/images/getImages.js";
import dataSetQuotation from "./dataSetQuotation.js";
import inputNumber from "./inputNumber.js";
import localStorage from "./localStorage.js";
import QuotationCalculation from './QuotationCalculation.js';
import nodeNotification from '../../helpers/nodeNotification.js';
import qnaddproduct from "../../helpers/qnaddproduct.js";
import { config } from "../../../config.js";
import ExpiringLocalStorage from '../localStore/ExpiringLocalStorage.js';
import onlyInputNumbers from "../../helpers/onlyInputNumbers.js";
import { getTranslation, langParam } from "../../lang.js";

const createProductCards = async (quotationNew, resQueryUser, resQueryProducts) => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const cotId = searchParams.get('cotId');

  if(resQueryUser.rol != "advisors") {
    qnaddproduct()
  }
  const bodyDom = document.querySelector('body')

  dataSetQuotation(resQueryUser)

  const loading = quotationNew.querySelector('.slider--productos .slider--content .quotation--loading')
  loading ? loading.remove() : false

  if (resQueryProducts.products.length > 0) {
    const expiringLocalStorage = new ExpiringLocalStorage();

    resQueryProducts.products.forEach((pro, index) => {
      let description = langParam === "es" ? pro.description : pro.descriptionEN;
      description = description ?? "";
      const spacingPosition = description.indexOf(" ", 40);
      description = spacingPosition === -1 ? description : description.substring(0, spacingPosition) + "...";

      // For Partner
      let pCuantity = pro.minQuantity
      pCuantity = 5

      let mainImage = pro.mainImage ? pro.mainImage : '../img/icon/image-product.jpg';
      const originUrlPath = config.API_DEV_IMAGE + '/sites/default/files/';
      let modifiedStringImage = mainImage.replace('public://', originUrlPath);
      modifiedStringImage = modifiedStringImage.replace(/ /g, '%20');
      let sliderRow =
      `<div class="slider--row">
        <div class="card">
          <div class="card__front">
            <div class="card--image">
              <img src="${modifiedStringImage}" loading="lazy" alt="Producto">
            </div>
            <div class="card--body">
              <h3 class="card--title quotation--title__quo">
                ${ langParam === "es" ? pro.name : (pro.nameEN ? pro.nameEN : pro.name) }
              </h3>
              <span class="card--reference">${pro.referencia ? pro.referencia : ''}</span>
              <p>${ description }</p>
            </div>
            <div class="card--actions">
              <button class="qnviewdetailproducts">Ver detalle</button>
              <button class="qnaddproducts add" data-tkey="add"></button>
            </div>
          </div>
          <div class="card__back">
            <label for="" data-tkey="mold_type"></label>
            <select id="" class="qncountry card__back--country">
              <option value="" selected data-tkey="select_default_option"></option>
            </select>
           <div id="card__back--items" class="card__back--items">
            <div class="inputman card--amount">
              <span class="card--amount__title" data-tkey="man"></span>
              <div class="card--amount__input">
                <button class="qnManDecrease">-</button>
                <input class="qnManInput colombiaMan" type="number" name="qnManInput" value="0" min="0">
                <button class="qnManIncrease">+</button>
              </div>
            </div>  
            <div class="inputwoman card--amount">
              <span class="card--amount__title" data-tkey="woman"></span>
              <div class="card--amount__input">
                <button class="qnWomanDecrease">-</button>
                <input class="qnWomanInput colombiaWoman" type="number" name="qnWomanInput" value="0" min="0">
                <button class="qnWomanIncrease">+</button>
              </div>
            </div>  
            <div class="inputunisex card--amount">
              <span class="card--amount__title" data-tkey="unisex"></span>
              <div class="card--amount__input">
                <button class="qnUnisexDecrease">-</button>
                <input class="qnUnisexInput colombiaUnisex" type="number" name="qnUnisexInput" value="0" min="0">
                <button class="qnUnisexIncrease">+</button>
              </div>
            </div>  
            <div class="inputjunior card--amount">
              <span class="card--amount__title" data-tkey="junior"></span>
              <div class="card--amount__input">
                <button class="qnJuniorDecrease">-</button>
                <input class="qnJuniorInput colombiaJunior" type="number" name="qnJuniorInput" value="0" min="0">
                <button class="qnJuniorIncrease">+</button>
              </div>
            </div>
            <div class="card--amount__actions">
             ${resQueryUser.rol === 'partner' ?
              `<p class="small"><span data-tkey="minimun_quantity_label"></span> ${pCuantity} ${pCuantity > 1 ? '<span data-tkey="units"></span>': '<span data-tkey="unit"></span>'}.</p>` :
              `<p class="small"><span data-tkey="minimun_quantity_label"></span> ${pro.minQuantity} ${pro.minQuantity > 1 ? '<span data-tkey="units"></span>': '<span data-tkey="unit"></span>'}.</p>`}
              <button class="qncancelproduct" data-tkey="cancel"></button>
              <button class="qnaceptproduct quotation-hide" data-tkey="add"></button>
            </div>
           </div>
          </div>
        </div>
      </div>`;

      const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content');
  
      sliderProducts.insertAdjacentHTML('afterbegin', `${sliderRow}`);
      if(resQueryUser.rol ==="advisors") {
        qnaddproduct();
      }

      sliderProducts.querySelectorAll("input[type=number]").forEach((input) => input.onkeydown = onlyInputNumbers);
 
      // Card button Agregar +
      const cardAddProducts = quotationNew.querySelector('.card .qnaddproducts');
      const sliderProductsRow = quotationNew.querySelector('.slider--productos .slider--content .slider--row');

      cardAddProducts.addEventListener('click', (e) => {
        e.target ? sliderProductsRow.classList.add('active') : false
        localStorage()
      });

      const button = quotationNew.querySelector('.qnaceptproduct');
      button.addEventListener('click', async (e) => {
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
          nodeNotification(await getTranslation("enter_quantity"));
          return;
        }

        const quantityToAdd = product.reduce((accumulator, currentValue) => {
          return accumulator + parseInt(currentValue.quantity);
        },0);

        let totalQuantity = quantityToAdd;
        let localProducts;
        if(cotId) {
          localProducts = expiringLocalStorage.getDataWithExpiration("scenario-" + cotId)
        }
        else{
          localProducts = expiringLocalStorage.getDataWithExpiration("products")
        }

        const codesToValidate = [pro.canadaMan, pro.canadaWoman, pro.colombiaJunior,
                            pro.colombiaMan, pro.colombiaUnisex, pro.colombiaWoman,
                            pro.vR7Man, pro.vR7Woman].join(",");

        if(localProducts){
          const localProductsObj = JSON.parse(localProducts);

          localProductsObj.forEach(p => {
            if(codesToValidate.includes(p.selectedMoldeCode)){
              totalQuantity += p.quantity;
            }
          });
        }

        if (resQueryUser.rol === 'partner') {
          if (totalQuantity < pCuantity) {
            nodeNotification(`${ await getTranslation("quantity_validation_error")} ${pCuantity}`);
            return;
          }
        } else {
          if (totalQuantity < pro.minQuantity) {
            nodeNotification(`${ await getTranslation("quantity_validation_error")} ${pro.minQuantity}`);
            return;
          }
        }

        nodeNotification(await getTranslation("adding_product"));
        const quotationCalculation = new QuotationCalculation(resQueryUser);
        quotationCalculation.createArrayProducto(product);
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

      const cardViewDetailProductsImage = quotationNew.querySelector('.card .card--image img');

      cardViewDetailProductsImage.addEventListener('click', async (e) => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Agrega un desplazamiento suave
        });

        bodyDom.style.overflow = 'hidden'
        if(e.target) {
          const modalCard =
          `<div class="modal">
            <div class="modal--container">
              <div class="modal--container__body">
                <div class="modal--container__bodyLeft">
                  <div class="image-product"></div>
                </div>
                <div class="modal--container__bodyRight">
                  <div class="modal--header">
                    <h3 class="quotation--title__quo">
                      ${ langParam === "es" ? pro.name : (pro.nameEN ? pro.nameEN : pro.name) }
                    </h3>
                  </div>
                  <div class="modal--body">
                    <div class="modal--body__content">
                    <h4 class="modal--title">${ await getTranslation("reference") } ${ pro.referencia }</h4>
                      <h4 class="modal--title">${ await getTranslation("sport") } ${ await getTranslation(pro.cuento) }</h4>
                      <h4 class="modal--title">${ await getTranslation("classification") } ${ await getTranslation(pro.classification) }</h4>
                      <h4 class="modal--title">${ await getTranslation("description") }</h4>
                      <div>
                        <p>${ langParam === "es" ? pro.description : (pro.descriptionEN ? pro.descriptionEN : pro.description )}</p>
                      </div>
                      <h4 class="modal--title">${ await getTranslation("features") }</h4>
                      <div>
                        <p>${ langParam === "es" ? pro.features : (pro.featuresEN ? pro.featuresEN : pro.features) }</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal--close">&#10005;</div>
            </div>
          </div>`

          quotationNew.style.overflow = 'hidden'
          quotationNew.insertAdjacentHTML('afterend', `${modalCard}`)
          const modal = document.querySelector('.modal')
          const modalClose = document.querySelector('.modal--close')
          modalClose.addEventListener('click', () => {
            bodyDom.style.overflow = 'initial'
            quotationNew.style.overflow = 'auto'
            modal.remove()
          })

          const imagesData = async () => {

            const containerLeft = document.querySelector('.modal--container__bodyLeft')
            const containerLeftImages = document.querySelector('.modal--container__bodyLeft .image-product')

            const spinnerImages = document.createElement('img')
            spinnerImages.classList.add('qnimage--auto')
            spinnerImages.src = '../img/icon/icon-spinner.gif'
            containerLeft.insertAdjacentElement('afterbegin', spinnerImages);
            // Get Images|
            let idProduct = pro.id
            let resQueryImages = await getImages(idProduct)
            resQueryImages.reverse()

            if (resQueryImages.length > 0) {
              resQueryImages.forEach(e => {
                // Get URL Image
                let mainImage = e.imageUrl ? e.imageUrl : '../img/icon/image-product.jpg'
                const originUrlPath = config.API_DEV_IMAGE + '/sites/default/files/';
                let modifiedStringImage = mainImage.replace('public://', originUrlPath);
                modifiedStringImage = modifiedStringImage.replace(/ /g, '%20');
                let img = `<div class="image-product-item">
                  <img class="" src="${modifiedStringImage}" title="Safetti" alt="Safetti" loading="lazy">
                </div>`
                containerLeftImages.insertAdjacentHTML('afterbegin', img);
              });
            } else {
              let img = `<div class="image-product-item">
                <img class="" src="../img/icon/image-product.jpg" title="Safetti" alt="Safetti" loading="lazy">
              </div>`
              containerLeftImages.insertAdjacentHTML('afterbegin', img);
            }

            const sliderOptions = {
              cellAlign: "center",
              pageDots: true,
              prevNextButtons: true,
              groupCells: 1,
              wrapAround: true,
              contain: true,
              lazyLoad: true,
              adaptiveHeight: true,
              imagesLoaded: true,
            };

            const initializeSlider = () => {
              const sliderElement = document.querySelector('.modal--container__bodyLeft .image-product');
              const images = sliderElement.querySelectorAll("img");
              zoomImagesSlider(images);

              if (sliderElement && sliderElement.children.length > 1) {
                try {
                  // Initialize Flickity on the element
                  new Flickity(sliderElement, sliderOptions);
                } catch (error) {
                  console.error("Error initializing Flickity:", error);
                }
              }
            };

            initializeSlider()
            spinnerImages.remove()
            // Initialize the slider when the DOM content is fully loaded
            document.addEventListener("DOMContentLoaded", initializeSlider);
          }

          imagesData()
        }
      })

      const idQnCountry = quotationNew.querySelector('.qncountry');
      const countryName = [
        {value:'colombia',text:'Estándar'},
        {value:'canada',text:'Extended'},
        {value:'vR7',text:'vR7'}];

      countryName.forEach((item) => {
        const optionElement = document.createElement('option');
        optionElement.value = item.value;
        optionElement.textContent = item.text;
        idQnCountry.appendChild(optionElement);
      });

      if (pro.colombiaMan === null && pro.colombiaWoman === null && pro.colombiaUnisex === null && pro.colombiaJunior === null) {
        const option = idQnCountry.querySelector(`option[value="colombia"]`);
        option ? option.remove() : null
      }
      if (pro.canadaMan === null && pro.canadaWoman === null) {
        const option = idQnCountry.querySelector(`option[value="canada"]`);
        option ? option.remove() : null
      }
      if (pro.vR7Man === null && pro.vR7Woman === null) {
        const option = idQnCountry.querySelector(`option[value="vR7"]`);
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
      amountM.classList.add('quotation-hide')

      const inputwoman = quotationNew.querySelector('.inputwoman')
      inputwoman.id = `inputwoman--${index + 1}`;
      let idInputwoman = quotationNew.querySelector(`#inputwoman--${index + 1}`);
      const amountW = idInputwoman.querySelector('.card--amount__input')
      amountW.classList.add('quotation-hide')

      const inputUnisex = quotationNew.querySelector('.inputunisex')
      inputUnisex.id = `inputunisex--${index + 1}`;
      let idInputUnisex = quotationNew.querySelector(`#inputunisex--${index + 1}`);
      const amountU = idInputUnisex.querySelector('.card--amount__input')
      amountU.classList.add('quotation-hide')

      const inputJunior = quotationNew.querySelector('.inputjunior')
      inputJunior.id = `inputjunior--${index + 1}`;
      let idInputJunior = quotationNew.querySelector(`#inputjunior--${index + 1}`);
      const amountJ = idInputJunior.querySelector('.card--amount__input')
      amountJ.classList.add('quotation-hide')

      const qnaceptProduct = quotationNew.querySelector('.qnaceptproduct')

      idQnCountry.addEventListener('change', (e) => {
        amountM.classList.remove('quotation-hide')
        amountW.classList.remove('quotation-hide')
        amountU.classList.remove('quotation-hide')
        amountJ.classList.remove('quotation-hide')

        if (idInputMan.classList.contains('quotation-hide')) {
          idInputMan.classList.remove('quotation-hide')
        }

        if (idInputwoman.classList.contains('quotation-hide')) {
          idInputwoman.classList.remove('quotation-hide')
        }

        if (idInputUnisex.classList.contains('quotation-hide')) {
          idInputUnisex.classList.remove('quotation-hide')
        }

        if (idInputJunior.classList.contains('quotation-hide')) {
          idInputJunior.classList.remove('quotation-hide')
        }

        if (e.target.value === 'colombia') {
          pro.colombiaMan === null ? idInputMan.classList.add('quotation-hide') : idInputMan.classList.remove('quotation-hide')
          pro.colombiaWoman === null ? idInputwoman.classList.add('quotation-hide') : idInputwoman.classList.remove('quotation-hide')
          pro.colombiaJunior === null ? idInputJunior.classList.add('quotation-hide') : idInputJunior.classList.remove('quotation-hide')
          pro.colombiaUnisex === null ? idInputUnisex.classList.add('quotation-hide') : idInputUnisex.classList.remove('quotation-hide')
          qnaceptProduct.classList.remove('quotation-hide')
        } else if (e.target.value === 'canada') {
          pro.canadaMan === null ? idInputMan.classList.add('quotation-hide') : idInputMan.classList.remove('quotation-hide')
          pro.canadaWoman === null ? idInputwoman.classList.add('quotation-hide') : idInputwoman.classList.remove('quotation-hide')
          idInputJunior.classList.add('quotation-hide')
          idInputUnisex.classList.add('quotation-hide')
          qnaceptProduct.classList.remove('quotation-hide') 
        } else if (e.target.value === 'vR7') {
          pro.vR7Man === null ? idInputMan.classList.add('quotation-hide') : idInputMan.classList.remove('quotation-hide')
          pro.vR7Woman === null ? idInputwoman.classList.add('quotation-hide') : idInputwoman.classList.remove('quotation-hide')
          idInputJunior.classList.add('quotation-hide')
          idInputUnisex.classList.add('quotation-hide')
          qnaceptProduct.classList.remove('quotation-hide')
        } else {
          amountM.classList.add('quotation-hide')
          amountW.classList.add('quotation-hide')
          amountU.classList.add('quotation-hide')
          amountJ.classList.add('quotation-hide')
          qnaceptProduct.classList.add('quotation-hide')
        }
      });
    });

  } else {
    const sliderProducts = quotationNew.querySelector('.slider--productos .slider--content')
    sliderProducts.insertAdjacentHTML('afterbegin', `<div class="quotation--loading"><span>${ await getTranslation("no_products_result")}</span></div>`)
  }

}

export default createProductCards

//@ts-check
function throttle(func, delay) {
  let isThrottled = false;
  return function(...args) {
      if (isThrottled) return;
      isThrottled = true;
      requestAnimationFrame(() => {
          func(...args);
          isThrottled = false;
      });
  };
}

function handleMouseMove(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;

  e.target.style.transformOrigin = `${xPercent}% ${yPercent}%`;
}

const zoomImagesSlider = (images) => {
  const image = images[0];
  images.forEach(image => {
    let zoom = false;
    image.addEventListener("click", () => {
      
      if(zoom) {
        image.style.transform = 'scale(1)';
        zoom = false
        return
      }
      
      image.style.transform = 'scale(2.5)';
      zoom = true
  
    })

    const throttleMouseMove = throttle(handleMouseMove, 1);
    image.addEventListener('mousemove', throttleMouseMove)
  })
}
